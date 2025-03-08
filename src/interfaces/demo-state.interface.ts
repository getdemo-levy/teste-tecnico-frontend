import { Demo } from "./demo.interface";
import { Frame } from "./frame.interface";

export interface DemoState {
  demoDetails: Demo | null;
  frames: Frame[];
  selectedFrame: Frame | null;
  hasUnsavedChanges: boolean;
  loading: boolean;
  saving: number;
  error: string | null;
}