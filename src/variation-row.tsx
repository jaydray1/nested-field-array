import {
  faArrowsAlt,
  faCopy,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Control,
  Controller,
  useFieldArray,
  UseFormRegister,
  UseFormSetValue
} from "react-hook-form";
import styled, { css } from "styled-components";
import { FormType } from "./app";

const FlexContainer = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 1px dashed #dddddd;
  padding: 32px;
`;

const OptionNameContainer = styled.div`
  flex: 1;
`;

const OptionVariantsContainer = styled.div`
  flex: 3;
`;

const Input = styled.input`
  border: 1px solid #cccccc;
  border-radius: 8px;
  padding: 12px;
`;

const Button = styled.button`
  height: 44px;
  background: #111111;
  border-radius: 0px 8px 8px 0px;
  color: white;
  border: none;
  flex: 1;
  &:disabled {
    background-color: #f5f5f5;
    color: #707070;
  }
`;

const InputWithAction = styled.div<{ $hasError: boolean }>`
  display: flex;
  border-radius: 8px;
  input {
    flex: 6;
  }

  ${({ $hasError }) =>
    $hasError &&
    css`
      border: 1px solid red;
    `}
`;

const ErrorText = styled.span`
  color: red;
  font-size: 12px;
  margin: 4px;
`;

const OptionActions = styled.div`
  display: flex;
  flex-direction: row;
`;

const IconButton = styled.button`
  width: 44px;
  height: 44px;
  cursor: pointer;
  border: none;
  background: none;
  border-radius: 22px;
  &:hover {
    background-color: #f5f5f5;
  }
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 8px;
`;

const OptionTag = styled.div`
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
  margin-right: 8px;
`;

const Select = styled.select`
  width: 100%;
  height: 44px;
  border-radius: 8px;
  border: 1px solid #cccccc;
  padding: 0px 8px;
`;

const LinkButton = styled.button`
  border: none;
  background: none;
  text-decoration: underline;
  color: #707070;
  font-size: 12px;
  padding: 0px;
  margin-right: 8px;
`;

const AddVariantContainer = styled.div`
  flex: 20;
`;

type VariationRowProps = {
  optionName: string;
  fieldName: string;
  isCustom: boolean;
  control: Control<FormType>;
  index: number;
  remove: () => void;
  setValue: UseFormSetValue<FormType>;
  selectedVariants: string[];
  register: UseFormRegister<FormType>;
  duplicate: () => void;
};

export const VariationRow = ({
  optionName,
  fieldName,
  isCustom,
  control,
  index,
  remove,
  setValue,
  selectedVariants,
  register,
  duplicate
}: VariationRowProps) => {
  const [optionValue, setOptionValue] = useState<string>();
  const [customOptionName, setCustomOptionName] = useState<string>();
  const [renaming, setRenaming] = useState<boolean>();

  const {
    fields: variants,
    append,
    prepend,
    remove: removeVariant,
    swap,
    move,
    insert
  } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: `${fieldName}.${index}.variants` // unique name for your Field Array
    // keyName: "id", default to "id", you can change the key name
  });

  const availableOptions = useMemo(
    () =>
      ["Color", "Style", "Font", "Custom Text", "Create my own option"].filter(
        (option) =>
          ["Custom Text", "Create my own option"].includes(option) ||
          !selectedVariants.includes(option)
      ),
    [selectedVariants]
  );

  const handleAddVariant = useCallback(() => {
    if (!variants.some(({ value }) => value === optionValue)) {
      append({ value: optionValue });
      setOptionValue("");
    }
  }, [variants, append, optionValue]);

  useEffect(() => {
    if (optionName === "Create my own option") {
      setRenaming(true);
    }
  }, [optionName]);

  return optionName ? (
    <FlexContainer>
      {renaming ? (
        <div style={{ height: "100%", marginRight: 8 }}>
          <Input
            placeholder="Option Name"
            value={customOptionName}
            onChange={(e) => setCustomOptionName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                setValue(`${fieldName}[${index}].name`, customOptionName);
                setValue(`${fieldName}[${index}].isCustom`, true);
                setRenaming(false);
              }
            }}
          />
        </div>
      ) : (
        <OptionNameContainer>
          <div>{optionName}</div>
          <div>
            {isCustom && (
              <LinkButton onClick={() => setRenaming(true)}>Rename</LinkButton>
            )}
            <LinkButton onClick={remove}>Delete</LinkButton>
          </div>
        </OptionNameContainer>
      )}

      <OptionVariantsContainer>
        <OptionActions>
          {optionName === "Custom Text" ? (
            <>
              <Input
                placeholder="Field Name"
                style={{ flex: 3, marginRight: 8 }}
                {...register(`${fieldName}[${index}].customFieldName`)}
              />
              <Input
                placeholder="Character Limit"
                type="number"
                style={{ flex: 3 }}
                {...register(`${fieldName}[${index}].customCharacterLimit`)}
              />
            </>
          ) : (
            <AddVariantContainer>
              <InputWithAction
                $hasError={variants.some(({ value }) => value === optionValue)}
              >
                <Input
                  placeholder="Add a variant..."
                  value={optionValue}
                  onChange={(e) => setOptionValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddVariant();
                    }
                  }}
                />
                <Button
                  onClick={() => {
                    handleAddVariant();
                  }}
                  disabled={
                    !optionValue ||
                    variants.some(({ value }) => value === optionValue)
                  }
                  type="button"
                >
                  Add
                </Button>
              </InputWithAction>

              {variants.some(({ value }) => value === optionValue) && (
                <ErrorText>This variant already exists.</ErrorText>
              )}
            </AddVariantContainer>
          )}

          <IconButton type="button" onClick={duplicate}>
            <FontAwesomeIcon icon={faCopy} />
          </IconButton>
          <IconButton type="button">
            <FontAwesomeIcon icon={faArrowsAlt} />
          </IconButton>
        </OptionActions>
        <OptionsContainer>
          {variants.map((variant, variantIndex) => (
            <OptionTag key={variant.id}>
              {variant.value}{" "}
              <IconButton
                onClick={() => removeVariant(variantIndex)}
                style={{ width: 10, height: 10 }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </IconButton>
            </OptionTag>
          ))}
        </OptionsContainer>
      </OptionVariantsContainer>
    </FlexContainer>
  ) : (
    <FlexContainer>
      <OptionNameContainer>
        <Controller
          name={`${fieldName}[${index}].name`}
          control={control}
          render={({ field: { onChange, onBlur, value, name, ref } }) => (
            <Select
              placeholder="Choose an Option"
              style={{ width: 260, height: 44 }}
              value={value}
              onChange={onChange}
              defaultValue=""
            >
              <option value="" disabled hidden>
                Choose an Option
              </option>
              {availableOptions.map((option) => (
                <option value={option}>{option}</option>
              ))}
            </Select>
          )}
        />
      </OptionNameContainer>
      <OptionVariantsContainer></OptionVariantsContainer>
    </FlexContainer>
  );
};
