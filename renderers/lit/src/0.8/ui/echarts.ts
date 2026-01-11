/*
 Copyright 2025 Google LLC

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      https://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

import { html, css, PropertyValues } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { Root } from "./root.js";
import * as echarts from "echarts";

@customElement("a2ui-echart")
export class EChart extends Root {
    @property({ type: Object })
    accessor options: any = null;

    @query("#chart-container")
    accessor chartContainer!: HTMLDivElement;

    private chart: echarts.ECharts | null = null;

    static styles = [
        css`
      :host {
        display: block;
        width: 100%;
        min-height: 400px;
        flex: 1;
      }
      #chart-container {
        width: 100%;
        height: 100%;
        min-height: 400px;
      }
    `,
    ];

    firstUpdated() {
        this.chart = echarts.init(this.chartContainer);
        if (this.options) {
            this.chart.setOption(this.options);
        }

        // Handle window resize
        const resizeObserver = new ResizeObserver(() => {
            this.chart?.resize();
        });
        resizeObserver.observe(this.chartContainer);
    }

    updated(changedProperties: PropertyValues) {
        super.updated(changedProperties);
        if (changedProperties.has("options") && this.chart && this.options) {
            this.chart.setOption(this.options);
        }
    }

    render() {
        return html`<div id="chart-container"></div>`;
    }
}
