/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import {KernelConfig, KernelFunc, TensorInfo, Unique, UniqueInputs} from '@tensorflow/tfjs-core';

import {MathBackendWebGL} from '../backend_webgl';
import {uniqueImplCPU} from '../kernel_utils/shared';
import {assertNotComplex} from '../webgl_util';

export function unique(args: {inputs: UniqueInputs, backend: MathBackendWebGL}):
    TensorInfo[] {
  const {inputs, backend} = args;
  const {x} = inputs;
  assertNotComplex(x, 'unique');

  // For now, always forward calculation to the CPU backend.
  const values = backend.readSync(x.dataId);
  const {outputValues, indices} = uniqueImplCPU(values, x.dtype);
  return [
    backend.makeTensorInfo(x.shape, x.dtype, outputValues),
    backend.makeTensorInfo([indices.length], 'int32', indices),
  ];
}

export const uniqueConfig: KernelConfig = {
  kernelName: Unique,
  backendName: 'webgl',
  kernelFunc: unique as {} as KernelFunc,
};