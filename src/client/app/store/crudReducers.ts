import { Dispatch, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ErrorMessage, CRUDState, CRUDActions, CRUDService, GlobalState, CRUDObject, CRUDStateMap } from "../../../types/types.ts";
import { Draft, WritableDraft } from 'immer';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from "../../../utils/console/showElement.ts";

export function createCRUDSlice<CRUDEntity extends CRUDObject>(sliceName: string, config = { emptyEntityIsValid: true }) {
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
          const { emptyEntityIsValid } = config;
          const payloadData = Array.isArray(action.payload) ? action.payload as Draft<CRUDEntity[]> : null;
          state.entities = payloadData;
          if (emptyEntityIsValid) {
            state.isLoaded = Boolean(action.payload);  
          }
          else {
            state.isLoaded = Boolean(action.payload?.length);
          }
        }
      },
      loadFailed(state: WritableDraft<CRUDState<CRUDEntity>>, action: PayloadAction<unknown>) {
        const { message } = action.payload as ErrorMessage;
        state.error = message || `Error occured in attempt of load ${action.type} but there is no error message to display`;
      },
      updateStateRequested() { },
      updateStateSucceed(state: WritableDraft<CRUDState<CRUDEntity>>, action: PayloadAction<CRUDEntity | CRUDEntity[]>) {
        if (Array.isArray(action.payload)) {
          if (state?.entities) action.payload.forEach((entity) => state.entities.push(entity));
        } else {
          if (state?.entities) state.entities.push(action.payload);
        }
      },
      updateStateFailed(state: WritableDraft<CRUDState<CRUDEntity>>, action: PayloadAction<unknown>) {
        state.error = action.payload;
      },
      updateRequested() { },
      updateSucceed(state: WritableDraft<CRUDState<CRUDEntity>>, action: PayloadAction<CRUDEntity>) {
        if (state?.entities) {
          const index = state.entities.findIndex((obj: CRUDEntity) => obj?._id === action.payload?._id);
          state.entities[index] = action.payload as Draft<CRUDEntity>;
        }
      },
      updateFailed(state: WritableDraft<CRUDState<CRUDEntity>>, action: PayloadAction<unknown>) {
        state.error = action.payload;
      },
      creationRequested() { },
      creationSucceed(state: WritableDraft<CRUDState<CRUDEntity>>, action: PayloadAction<CRUDEntity>) {
        if (state?.entities) state?.entities?.push(action.payload as Draft<CRUDEntity>);
      },
      creationFailed(state: WritableDraft<CRUDState<CRUDEntity>>, action: PayloadAction<unknown>) {
        const { message } = action.payload as ErrorMessage;
        state.error = message || `Error occured in attempt of create ${action.type} but there is no error message to display`;
      },
      deleteRequested() { },
      deleteSucceed(state: WritableDraft<CRUDState<CRUDEntity>>, action: PayloadAction<string>) {
        if (state.entities) {
          state.entities = state.entities.filter((op: CRUDEntity) => op?._id !== action.payload);
        }
      },
      deleteFailed(state: WritableDraft<CRUDState<CRUDEntity>>, action: PayloadAction<unknown>) {
        const message = action.payload as { message: string };
        state.error = message || `Error occured in attempt of delete ${action.type} but there is no error message to display`;
      }
    }
  };
  const crudSlice = createSlice(sliceConfig);
  return crudSlice;
}

export function createCRUDFunctions<CRUDEntity>(actions: CRUDActions<CRUDEntity>, service: CRUDService<CRUDEntity>) {
  const loadData = createLoadFunction(actions, service);
  const createData = createCreationFunction(actions, service);
  const updateData = createUpdateFunction(actions, service);
  const deleteData = createDeleteFunction(actions, service);
  const updateState = createUpdateStateFunction(actions);

  return { loadData, createData, updateData, deleteData, updateState };
}
export function createCRUDGetters<StoreName extends keyof CRUDStateMap>(storeName: StoreName) {
  const getList = createGetListFunction<StoreName>(storeName);
  const getLoadStatus = createGetLoadStatusFunction<StoreName>(storeName);
  const getElementById = createGetElementById<StoreName>(storeName);

  return { getList, getLoadStatus, getElementById };
}

function createLoadFunction<CRUDEntity>(actions: CRUDActions<CRUDEntity>, service: CRUDService<CRUDEntity>) {
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
function createUpdateStateFunction<CRUDEntity>(actions: CRUDActions<CRUDEntity>) {
  return function updateState(payload: CRUDEntity) {
    return function dispatchUpdate(dispatch: Dispatch) {
      const { updateStateRequested, updateStateSucceed, updateStateFailed } = actions;
      dispatch(updateStateRequested());
      try {
        dispatch(updateStateSucceed(payload));
        return true;
      } catch (err) {
        dispatch(updateStateFailed(err));
      }
    }
  }
}
function createCreationFunction<CRUDEntity>(actions: CRUDActions<CRUDEntity>, service: CRUDService<CRUDEntity>) {
  return function createData(payload: CRUDEntity) {
    return async function dispatchCreation(dispatch: Dispatch): Promise<CRUDEntity | null> {
      const { creationRequested, creationSucceed, creationFailed } = actions;
      dispatch(creationRequested());
      try {
        const createdItem = await service.create(payload);
        dispatch(creationSucceed(createdItem));
        return createdItem;
      } catch (err) {
        const { message } = err as ErrorMessage;
        dispatch(creationFailed(message));
        return null;
      }
    };
  };
}
function createUpdateFunction<CRUDEntity>(actions: CRUDActions<CRUDEntity>, service: CRUDService<CRUDEntity>) {
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
function createDeleteFunction<CRUDEntity>(actions: CRUDActions<CRUDEntity>, service: CRUDService<CRUDEntity>) {
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

function createGetListFunction<StoreName extends keyof CRUDStateMap>(storeName: StoreName) {
  return function getList() {
    return function findList(state: GlobalState): CRUDStateMap[StoreName][] | null {
      const crudState = state[storeName] as CRUDState<CRUDStateMap[StoreName]>;
      return crudState.entities;
    };
  };
}
function createGetLoadStatusFunction<StoreName extends keyof CRUDStateMap>(storeName: StoreName) {
  return function getLoadStaus() {
    return (s: GlobalState): boolean => s[storeName].isLoaded;
  };
};
function createGetElementById<StoreName extends keyof CRUDStateMap>(storeName: StoreName) {
  return function getElementById(id: string) {
    return (s: GlobalState): CRUDStateMap[StoreName] | undefined => {
      const crudState = s[storeName] as CRUDState<CRUDStateMap[StoreName]>;
      return crudState.entities?.find((elem) => elem?._id === id);
    };
  };
}
