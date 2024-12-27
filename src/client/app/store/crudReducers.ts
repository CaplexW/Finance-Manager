import { Dispatch, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ErrorMessage, CRUDState, CrudActions, CrudService, GlobalState, CrudStoreName, CRUDObject, CrudStoreObjects } from "../../../types/types.ts";
import { WritableDraft } from 'immer';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from "../../../utils/console/showElement.ts";

export function createCrudSlice<CRUDEntity extends CRUDObject>(sliceName: string) {
  const initialState: CRUDState<CRUDEntity> = {
    entities: [],
    isLoaded: false,
    error: null,
  };
  const sliceConfig = {
    name: sliceName,
    initialState,
    reducers: {
      loadRequested() { },
      loadSucceed(state: WritableDraft<CRUDState<CRUDEntity>>, action: PayloadAction<CRUDEntity[]>) {
        if (state) {
          state.entities = action.payload;
          state.isLoaded = Boolean(action.payload);
        }
      },
      loadFailed(state: WritableDraft<CRUDState<CRUDEntity>>, action: PayloadAction<unknown>) {
        const { message } = action.payload as ErrorMessage;
        state.error = message;
      },
      updateRequested() { },
      updateSucceed(state: WritableDraft<CRUDState<CRUDEntity>>, action: PayloadAction<CRUDEntity>) {
        if (state?.entities) {
          const index = state.entities.findIndex((obj) => obj?._id === action.payload?._id);
          state.entities[index] = action.payload;
        }
      },
      updateFailed(state: WritableDraft<CRUDState<CRUDEntity>>, action: PayloadAction<unknown>) {
        state.error = action.payload;
      },
      creationRequested() { },
      creationSucceed(state: WritableDraft<CRUDState<CRUDEntity>>, action: PayloadAction<CRUDEntity>) {
        if(state?.entities) state?.entities?.push(action.payload);
      },
      creationFailed(state: WritableDraft<CRUDState<CRUDEntity>>, action: PayloadAction<unknown>) {
        const message = action.payload as { message: string };
        state.error = message;
      },
      deleteRequested() { },
      deleteSucceed(state: WritableDraft<CRUDState<CRUDEntity>>, action: PayloadAction<string>) {
        if (state.entities) {
          state.entities = state.entities.filter((op) => op?._id !== action.payload);
        }
      },
      deleteFailed(state: WritableDraft<CRUDState<CRUDEntity>>, action: PayloadAction<unknown>) {
        const message = action.payload as { message: string };
        state.error = message;
      }
    }
  };
  const crudSlice = createSlice(sliceConfig);
  return crudSlice;
}

export function createCrudFunctions<CRUDEntity>(actions: CrudActions<CRUDEntity>, service: CrudService<CRUDEntity>) {
  const loadData = createLoadFunction(actions, service);
  const createData = createCreationFunction(actions, service);
  const updateData = createUpdateFunction(actions, service);
  const deleteData = createDeleteFunction(actions, service);

  return { loadData, createData, updateData, deleteData };
}
export function createCrudGetters<CRUDEntity>(storeName: CrudStoreName) {
  const getList = createGetListFunction<CRUDEntity>(storeName);
  const getLoadStatus = createGetLoadStatusFunction<CRUDEntity>(storeName);
  const getElementById = createGetElementById<CRUDEntity>(storeName);

  return { getList, getLoadStatus, getElementById };
}

function createLoadFunction<CRUDEntity>(actions: CrudActions<CRUDEntity>, service: CrudService<CRUDEntity>) {
  return function loadData() {
    return async function dispatchRequest(dispatch: Dispatch) {
      const { loadRequested, loadSucceed, loadFailed } = actions;
      dispatch(loadRequested());
      try {
        const list = await service.getList();
        dispatch(loadSucceed(list));
      } catch (err) {
        const { message } = err as ErrorMessage;
        dispatch(loadFailed(message));
      }
    };
  };
}
function createCreationFunction<CRUDEntity>(actions: CrudActions<CRUDEntity>, service: CrudService<CRUDEntity>) {
  return function createData(payload: CRUDEntity) {
    return async function dispatchCreation(dispatch: Dispatch): Promise<CRUDEntity | null> {
      const { creationRequested, creationSucceed, creationFailed } = actions;
      dispatch(creationRequested());
      try {
        const createdOperation = await service.create(payload);
        dispatch(creationSucceed(createdOperation));
        return createdOperation;
      } catch (err) {
        const { message } = err as ErrorMessage;
        dispatch(creationFailed(message));
        return null;
      }
    };
  };
}
function createUpdateFunction<CRUDEntity>(actions: CrudActions<CRUDEntity>, service: CrudService<CRUDEntity>) {
  return function updateData(payload: CRUDEntity) {
    return async function dispatchUpdate(dispatch: Dispatch): Promise<CRUDEntity | null> {
      const { updateRequested, updateSucceed, updateFailed } = actions;
      dispatch(updateRequested());
      try {
        const updatedOperation = await service.update(payload);
        dispatch(updateSucceed(updatedOperation));
        return updatedOperation;
      } catch (err) {
        const { message } = err as ErrorMessage;
        dispatch(updateFailed(message));
        return null;
      }
    };
  };
}
function createDeleteFunction<CRUDEntity>(actions: CrudActions<CRUDEntity>, service: CrudService<CRUDEntity>) {
  return function deleteOperation(operationId: string) {
    return async function findAndremoveUser(dispatch: Dispatch): Promise<boolean | null> {
      const { deleteRequested, deleteSucceed, deleteFailed } = actions;
      dispatch(deleteRequested());
      try {
        const result = await service.delete(operationId);
        dispatch(deleteSucceed(operationId));
        return Boolean(result.result);
      } catch (err) {
        const { message } = err as ErrorMessage;
        dispatch(deleteFailed(message));
        return null;
      }
    };
  };
}

function createGetListFunction<CRUDEntity>(storeName: CrudStoreName) {
  return function getList() {
    return function findList(state: GlobalState): CRUDEntity[] | null {
      const crudState = state[storeName];
      return crudState.entities;
    };
  };
}
function createGetLoadStatusFunction(storeName: CrudStoreName) {
  return function getLoadStaus() {
    return (s: GlobalState): boolean => s[storeName].isLoaded;
  };
};
function createGetElementById(storeName: CrudStoreName) {
  return function getElementById(id: string) {
    return (s: GlobalState) => s[storeName].entities?.find((elem) => elem?._id === id);
  };
}
