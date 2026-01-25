import React, {
  cloneElement, useCallback, useEffect, useState, Children, ReactElement, ReactNode, FormEvent, KeyboardEvent,
} from 'react';
import validator from '../../../utils/validation/validator';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from '../../../utils/console/showElement';

type ValidatorConfig = Record<string, unknown>;

interface FormProps<TData extends Record<string, unknown>> {
  children: ReactNode;
  validatorConfig?: ValidatorConfig;
  onSubmit?: (data: TData) => void;
  defaultData?: TData;
  dataScheme?: Partial<TData>;
}

const emptyObject = {} as const;

export default function Form<TData extends Record<string, unknown>>({
  children,
  validatorConfig,
  onSubmit = noSubmitWarning,
  defaultData = emptyObject as TData,
  dataScheme = {} as Partial<TData>,
}: FormProps<TData>): JSX.Element {
  const [data, setData] = useState<TData>(defaultData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formIsInvalid, setFormIsInvalid] = useState<boolean>(Object.keys(errors).length !== 0);

  useEffect(() => setFormIsInvalid(Object.keys(errors).length !== 0), [errors]);

  const formIsValidating = !!validatorConfig;
  const dataExists = Object.keys(data).length > 0;

  const validate = useCallback((validatingData: TData | Partial<TData>): boolean => {
    const errorsObj = validator(validatingData, validatorConfig as ValidatorConfig);
    setErrors(errorsObj);

    return Object.keys(errorsObj).length === 0;
  }, [validatorConfig]);

  function validateData(): void {
    if (formIsValidating && dataExists) validate(data);
  }
  useEffect(validateData, [data]);

  const handleChange = useCallback((target: { name: string; value: unknown }) => {
    if (target.value !== undefined) {
      setData((prevState) => ({ ...prevState, [target.name]: target.value } as TData));
    }
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (formIsValidating) {
      const finalData = { ...dataScheme, ...data } as TData;
      const formIsValid = validate(finalData);
      if (formIsValid) {
        onSubmit(finalData);
        setData(defaultData);
      }
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLFormElement>): void {
    if (event.key === 'Enter') {
      const form = event.currentTarget; // В форме есть input'ы с type="hidden" от мультиселекта.
      const visibleForm = Array.from(form.elements).filter((element) => (element as HTMLInputElement).type !== 'hidden');
      const indexInput = visibleForm.indexOf(event.target as Element);
      const nextInput = visibleForm[indexInput + 1] as HTMLElement | undefined;
      const currentElement = visibleForm[indexInput] as HTMLElement;
      if (currentElement.tagName !== 'BUTTON' && nextInput) {
        event.preventDefault();
        nextInput.focus();
      }
    }
  }

  const clonedChildren = Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    const childType = typeof child.type;
    let props: Record<string, unknown> = {};

    if (childType === 'string') {
      if (child.type === 'button') {
        if (child.props.type === 'submit' || child.props.type === undefined) {
          props = { ...child.props, disabled: formIsInvalid };
        }
      }
    }
    if (childType === 'object' || childType === 'function') {
      if (!child.props.name) {
        throw new Error(`name property is required for component ${child.props.label}`);
      }
      props = {
        ...child.props,
        onChange: handleChange,
        value: (data as Record<string, unknown>)[child.props.name],
        error: errors[child.props.name as string],
      };
    }
    return cloneElement(child as ReactElement, props);
  });

  return (
    <form className="form" onKeyDown={handleKeyDown} onSubmit={handleSubmit}>
      {clonedChildren}
    </form>
  );
}

function noSubmitWarning(): void {
  // eslint-disable-next-line no-console
  console.error('You trying to submit a form, but no function handling submit event were added to this form');
}

