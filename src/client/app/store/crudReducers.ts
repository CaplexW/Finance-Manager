import { Dispatch, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ErrorMessage, CrudDataState, CrudData, CrudActions, CrudService, GlobalState, CrudStoreName } from "../../../types/types.ts";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from "../../../utils/console/showElement.ts";

export function createCrudSlice(sliceName: string) {
  const initialState = {
    entities: [],
    isLoaded: false,
    error: null,
  };
  const sliceConfig = {
    name: sliceName,
    initialState,
    reducers: {
      loadRequested() { },
      loadSucceed(state: CrudDataState, action: PayloadAction<CrudData[]>) {
        if (state) {
          state.entities = action.payload;
          state.isLoaded = Boolean(action.payload);
        }
      },
      loadFailed(state: CrudDataState, action: PayloadAction<unknown>) {
        const { message } = action.payload as ErrorMessage;
        state.error = message;
      },
      updateRequested() { },
      updateSucceed(state: CrudDataState, action: PayloadAction<CrudData>) {
        if (state?.entities) {
          const index = state.entities.findIndex((obj) => obj?._id === action.payload?._id);
          state.entities[index] = action.payload;
        }
      },
      updateFailed(state: CrudDataState, action: PayloadAction<unknown>) {
        state.error = action.payload;
      },
      creationRequested() { },
      creationSucceed(state: CrudDataState, action: PayloadAction<CrudData>) {
        state?.entities?.push(action.payload);
      },
      creationFailed(state: CrudDataState, action: PayloadAction<unknown>) {
        const message = action.payload as { message: string };
        state.error = message;
      },
      deleteRequested() { },
      deleteSucceed(state: CrudDataState, action: PayloadAction<string>) {
        if (state.entities) {
          state.entities = state.entities.filter((op) => op?._id !== action.payload);
        }
      },
      deleteFailed(state: CrudDataState, action: PayloadAction<unknown>) {
        const message = action.payload as { message: string };
        state.error = message;
      }
    }
  };
  const crudSlice = createSlice(sliceConfig);
  return crudSlice;
}

export function createCrudFunctions(actions: CrudActions, service: CrudService<CrudData>) {
  const loadData = createLoadFunction(actions, service);
  const createData = createCreationFunction(actions, service);
  const updateData = createUpdateFunction(actions, service);
  const deleteData = createDeleteFunction(actions, service);

  return { loadData, createData, updateData, deleteData };
}
export function createCrudGetters(storeName: CrudStoreName) {
  const getList = createGetListFunction(storeName);
  const getLoadStatus = createGetLoadStatusFunction(storeName);
  const getElementById = createGetElementById(storeName);

  return { getList, getLoadStatus, getElementById };
}

function createLoadFunction(actions: CrudActions, service: CrudService<CrudData>) {
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
function createCreationFunction(actions: CrudActions, service: CrudService<CrudData>) {
  return function createData(payload: CrudData) {
    return async function dispatchCreation(dispatch: Dispatch): Promise<CrudData | null> {
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
function createUpdateFunction(actions: CrudActions, service: CrudService<CrudData>) {
  return function updateData(payload: CrudData) {
    return async function dispatchUpdate(dispatch: Dispatch): Promise<CrudData | null> {
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
function createDeleteFunction(actions: CrudActions, service: CrudService<CrudData>) {
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

function createGetListFunction(storeName: CrudStoreName) {
  return function getList() {
    return function findList(state: GlobalState): CrudData[] | null {
      return state[storeName].entities;
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
    return (s: GlobalState):CrudData | undefined => s[storeName].entities?.find((elem) => elem?._id === id);
  }
}