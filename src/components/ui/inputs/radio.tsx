// ==============================
// Imports
// ==============================

import * as React from "react";
import { cn } from "@/utils";

import { DivElementProps, InputElementProps } from "@/types";
import { Label } from "../label";

// ==============================
// Props
// ==============================

interface RadioProps extends InputElementProps {
  label?: string;
}

interface RadioGroupProps extends DivElementProps {
  checked?: boolean;
  defaultValue?: string;
  checkedStyle?: string;
  hideRadio?: boolean;
  onValueChange?: (id: string) => void;
}

// ==============================
// Context
// ==============================

interface RadioGroupContextProps {
  checked?: boolean;
  defaultValue?: string;
  checkedStyle?: string;
  hideRadio?: boolean;
  onValueChange?: (id: string) => void;
}

interface RadioGroupProviderProps {
  checked?: boolean;
  defaultValue?: string;
  checkedStyle?: string;
  hideRadio?: boolean;
  onValueChange?: (id: string) => void;
  children?: React.ReactNode;
}

const RadioGroupContext = React.createContext<RadioGroupContextProps>({});

// ==============================
// Hooks
// ==============================

const useRadioGroup = () => {
  const ctx = React.useContext(RadioGroupContext);
  if (!ctx) {
    throw new Error(
      "RadioGroup components must be used within RadioGroupProvider",
    );
  }
  return ctx;
};

// ==============================
// Controlled Logic
// ==============================

const useRadioState = (
  checkedProp?: boolean,
  valueProp?: string,
  defaultValue?: string,
  onValueChange?: (id: string) => void,
) => {
  const isControlled = checkedProp !== undefined || valueProp !== undefined;
  const ctx = useRadioGroup();
  const [uncontrolledValue, setUncontrolledValue] = React.useState(
    defaultValue ?? "",
  );

  const value = isControlled ? (checkedProp ?? valueProp!) : uncontrolledValue;

  const setValue = React.useCallback<
    React.Dispatch<React.SetStateAction<string>>
  >(
    (value) => {
      const next =
        typeof value === "function" ? value(uncontrolledValue) : value;
      if (!isControlled) {
        setUncontrolledValue(next);
      }
      ctx.onValueChange?.(next);
    },
    [isControlled, ctx.onValueChange, uncontrolledValue],
  );

  return { value, setValue, isControlled };
};

// ==============================
// Handlers
// ==============================

const useRadioHandlers = (
  setValue: React.Dispatch<React.SetStateAction<string>>,
) => {
  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    },
    [setValue],
  );

  return { handleChange };
};

// ==============================
// Styles
// ==============================

const useRadioStyles = (checkedStyle?: string, hideRadio?: boolean) => {
  return {
    checkedStyle: `data=[state=checked]:${checkedStyle}`,
    hideRadio: hideRadio,
  };
};
// ==============================
// Provider
// ==============================

const RadioGroupProvider = ({
  checked,
  defaultValue,
  checkedStyle,
  hideRadio,
  onValueChange,
  children,
}: RadioGroupProviderProps) => {
  const state = useRadioState(
    checked,
    defaultValue,
    defaultValue,
    onValueChange,
  );
  const handlers = useRadioHandlers(state.setValue);
  const styles = useRadioStyles(checkedStyle, hideRadio);
  const value = React.useMemo(
    () => ({
      ...state,
      ...handlers,
      ...styles,
    }),
    [state, handlers, styles],
  );
  return (
    <RadioGroupContext.Provider value={value}>
      {children}
    </RadioGroupContext.Provider>
  );
};

// ==============================
// Component
// ==============================

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ name, id, label = "", checked, className, children, ...props }, ref) => {
    const { checked: checkedState, checkedStyle, hideRadio } = useRadioGroup();
    return (
      <Label
        htmlFor={id}
        data-state={
          (checked ?? checkedState ?? false) ? "checked" : "unchecked"
        }
        className={checkedStyle}
      >
        <input
          ref={ref}
          data-slot="radio-input"
          type="radio"
          name={name}
          id={id}
          checked={checked ?? checkedState ?? false}
          className={cn(
            "size-5 rounded-full border checked:border-primary checked:border-5",
            hideRadio && "hidden",
            className,
          )}
          {...props}
        />
        {label || children}
      </Label>
    );
  },
);

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      checked,
      defaultValue,
      checkedStyle,
      hideRadio,
      onValueChange,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <RadioGroupProvider
        checked={checked}
        defaultValue={defaultValue}
        checkedStyle={checkedStyle}
        hideRadio={hideRadio}
        onValueChange={onValueChange}
      >
        <div
          ref={ref}
          data-slot="radio-group"
          className={cn("", className)}
          {...props}
        >
          {children}
        </div>
      </RadioGroupProvider>
    );
  },
);

// ==============================
// Exports
// ==============================

Radio.displayName = "Radio";
RadioGroup.displayName = "RadioGroup";

export { Radio, RadioGroup };
export type { RadioProps, RadioGroupProps };
