import type { ComponentType } from "react";
import type { DemoProps } from "@/components/demo/context";
import SegmentedControl from "./SegmentedControl";
import ToggleSwitch from "./ToggleSwitch";
import Chip from "./Chip";
import Slider from "./Slider";
import QuantityStepper from "./QuantityStepper";
import Autocomplete from "./Autocomplete";
import DatePicker from "./DatePicker";
import Select from "./Select";
import Checkbox from "./Checkbox";
import RadioButton from "./RadioButton";
import FloatingLabel from "./FloatingLabel";
import PasswordToggle from "./PasswordToggle";
import FileUpload from "./FileUpload";
import Rating from "./Rating";

export const inputDemos: Record<string, ComponentType<DemoProps>> = {
  "segmented-control": SegmentedControl,
  "toggle-switch": ToggleSwitch,
  chip: Chip,
  slider: Slider,
  "quantity-stepper": QuantityStepper,
  autocomplete: Autocomplete,
  "date-picker": DatePicker,
  select: Select,
  checkbox: Checkbox,
  "radio-button": RadioButton,
  "floating-label": FloatingLabel,
  "password-toggle": PasswordToggle,
  "file-upload": FileUpload,
  rating: Rating,
};
