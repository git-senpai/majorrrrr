/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CrowdLevel = 'low' | 'medium' | 'high' | 'very_high' | 'overcrowded' | 'closed';

export interface Zone {
  id: string;
  name: string;
  crowd: CrowdLevel;
  description?: string;
  x: number; // 0-100 for SVG positioning
  y: number; // 0-100 for SVG positioning
}

export interface DetailedGraphData {
  timeLabels: string[];
  crowdDensity: number[];
  movementSpeed: number[];
  riskFactor: number[];
}

export interface LocationData {
  location: string;
  type: string;
  time: string;
  summary: string;
  capacityPercentage: number;
  riskIndex: number;
  zones: Zone[];
  detailedGraphs?: DetailedGraphData;
}

export interface RecentSearch {
  location: string;
  timestamp: number;
}
