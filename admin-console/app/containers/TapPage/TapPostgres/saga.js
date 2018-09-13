import { call, put, select, takeLatest } from 'redux-saga/effects';
import {
  LOAD_STREAMS,
  SAVE_CONFIG,
  TEST_CONNECTION,
  UPDATE_STREAM_TO_REPLICATE,
  SET_TRANSFORMATION,
  DISCOVER_TAP
} from './constants';
import {
  streamsLoaded,
  streamsLoadedError,
  saveConfigDone,
  saveConfigError,
  updateStreamToReplicateDone,
  updateStreamToReplicateError,
  setTransformationDone,
  setTransformationError,
  discoverTapDone,
  discoverTapError,
  testConnectionSucces,
  testConnectionError,
} from './actions';

import request from 'utils/request';

export function* getStreams(action) {
  const requestURL = `http://localhost:5000/targets/${action.targetId}/taps/${action.tapId}/streams`;

  try {
    const streams = yield call(request, requestURL);
    yield put(streamsLoaded(streams));
  } catch (err) {
    yield put(streamsLoadedError(err));
  }
}

export function* saveConfig(action) {
  const requestURL = `http://localhost:5000/targets/${action.targetId}/taps/${action.tapId}/config`
  console.log(requestURL)

  try {
    const response = yield call(request, requestURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(action.config)
    });
    yield put(saveConfigDone(response))
  } catch (err) {
    yield put(saveConfigError(err))
  }
}

export function* testConnection(action) {
  const requestURL = `http://localhost:5000/targets/${action.targetId}/taps/${action.tapId}/testconnection`
  console.log(requestURL)

  try {
    const response = yield call(request, requestURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(action.config)
    });
    yield put(testConnectionSucces(response))
  } catch (err) {
    yield put(testConnectionError(err))
  }
}

export function* updateStreamToReplicate(action) {
  const requestURL = `http://localhost:5000/targets/${action.targetId}/taps/${action.tapId}/streams/${action.streamId}`;

  try {
    const response = yield call(request, requestURL, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(action.params),
    });
    yield put(updateStreamToReplicateDone(response));
  } catch (err) {
    yield put(updateStreamToReplicateError(err));
  }
}

export function* setTransformation(action) {
  const requestURL = `http://localhost:5000/targets/${action.targetId}/taps/${action.tapId}/transformations/${action.stream}/${action.fieldId}`;

  try {
    const response = yield call(request, requestURL, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: action.value })
    })
    yield put(setTransformationDone(response));
  } catch (err) {
    yield put(setTransformationError(err));
  }
}

export function* discoverTap(action) {
  const requestURL = `http://localhost:5000/targets/${action.targetId}/taps/${action.tapId}/discover`;

  try {
    const response = yield call(request, requestURL, {
      method: 'POST',
    });
    yield put(discoverTapDone(response));
  } catch (err) {
    yield put(discoverTapError(err));
  }
}

export default function* tapPostgresData() {
  yield takeLatest(LOAD_STREAMS, getStreams);
  yield takeLatest(SAVE_CONFIG, saveConfig);
  yield takeLatest(TEST_CONNECTION, testConnection);
  yield takeLatest(UPDATE_STREAM_TO_REPLICATE, updateStreamToReplicate);
  yield takeLatest(SET_TRANSFORMATION, setTransformation)
  yield takeLatest(DISCOVER_TAP, discoverTap);
}
