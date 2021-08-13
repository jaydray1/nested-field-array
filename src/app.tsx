import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Controller,
  NestedValue,
  useFieldArray,
  useForm
} from "react-hook-form";
import styled from "styled-components";
import "./style.css";
import { VariationRow } from "./variation-row";

const SkuGroupVariations = styled.div`
  border: 1px solid #dddddd;
  border-radius: 8px;
  margin-bottom: 16px;
`;

const Button = styled.button`
  border: 1px solid #dddddd;
  border-radius: 8px;
  padding: 16px 24px;
  background-color: white;
  cursor: pointer;
  &:hover {
    border-color: black;
  }
`;

const PaddedContainer = styled.div`
  padding: 24px 32px;
`;

const onSubmit = (data) => {
  console.log(data);
};

type Variation = {
  name: string;
  isCustom?: boolean;
  customFieldName?: string;
  customCharacterLimit?: string;
  isDuplicate?: boolean;
};

export type FormType = {
  regularVariations: NestedValue<Variation[]>;
  personalizedVariations: NestedValue<Variation[]>;
};

export default function App() {
  const { control, register, watch, setValue, handleSubmit } = useForm<
    FormType
  >({
    defaultValues: {
      regularVariations: [],
      personalizedVariations: []
    }
  });
  const {
    fields: regularVariationsFields,
    append: appendRegularVariation,
    prepend,
    remove: removeRegularVariation,
    swap,
    move,
    insert
  } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "regularVariations" // unique name for your Field Array
    // keyName: "id", default to "id", you can change the key name
  });
  const {
    fields: personalizedVariationsFields,
    append: appendPersonalizedVariation,
    remove: removePersonalizedVariation
  } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "personalizedVariations" // unique name for your Field Array
    // keyName: "id", default to "id", you can change the key name
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SkuGroupVariations>
        <PaddedContainer>
          <h2>Options &amp; Variants</h2>
        </PaddedContainer>

        {regularVariationsFields.map((field, index) => {
          return (
            <VariationRow
              key={field.id}
              optionName={watch(
                `regularVariations[${index}].name` as "regularVariations.0.name"
              )}
              isCustom={watch(
                `regularVariations.${index}.isCustom` as "regularVariations.0.isCustom"
              )}
              fieldName="regularVariations"
              selectedVariants={watch(`regularVariations`).map(
                ({ name }) => name
              )}
              duplicate={() => {
                const fieldToCopy = field;

                delete fieldToCopy.id;
                appendRegularVariation({
                  ...fieldToCopy,
                  isDuplicate: true,
                  isCustom: true,
                  name: `${field.name} Duplicate`
                });
              }}
              register={register}
              control={control}
              setValue={setValue}
              index={index}
              remove={() => {
                removeRegularVariation(index);
              }}
            />
          );
        })}
        <PaddedContainer>
          <Button onClick={() => appendRegularVariation({})}>
            <FontAwesomeIcon icon={faPlus} /> Add Another Option
          </Button>
        </PaddedContainer>
      </SkuGroupVariations>
      <SkuGroupVariations>
        <PaddedContainer>
          <h2>Personalization</h2>
        </PaddedContainer>

        {personalizedVariationsFields.map((field, index) => {
          return (
            <VariationRow
              key={field.id}
              optionName={watch(
                `personalizedVariations[${index}].name` as "personalizedVariations.0.name"
              )}
              fieldName="personalizedVariations"
              isCustom={watch(
                `personalizedVariations[${index}].isCustom` as "personalizedVariations.0.isCustom"
              )}
              selectedVariants={watch(`personalizedVariations`).map(
                ({ name }) => name
              )}
              register={register}
              control={control}
              setValue={setValue}
              duplicate={() => {
                const fieldToCopy = field;

                delete fieldToCopy.id;
                appendPersonalizedVariation({
                  ...fieldToCopy,
                  isDuplicate: true,
                  isCustom: true,
                  name: `${field.name} Duplicate`
                });
              }}
              index={index}
              remove={() => {
                removePersonalizedVariation(index);
              }}
            />
          );
        })}
        <PaddedContainer>
          <Button onClick={() => appendPersonalizedVariation({})}>
            <FontAwesomeIcon icon={faPlus} /> Add Another Option
          </Button>
        </PaddedContainer>
      </SkuGroupVariations>

      <button type="submit">Submit</button>
    </form>
  );
}
