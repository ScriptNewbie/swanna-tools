import { Button, Checkbox, Flex, Input } from "@chakra-ui/react";
import { Mass as MassType } from "../utils/massUtils";
import Autocomplete from "./Autocomplete";

interface Props {
  mass: MassType;
  autocompleteData: string[];
  onDelete: (massId: number) => void;
  onPropertyChange: (
    massId: number,
    propertyName: string,
    newValue: string | boolean
  ) => void;
}

function Mass({ mass, onPropertyChange, onDelete, autocompleteData }: Props) {
  return (
    <Flex ml={"3rem"} grow={1} gap={2} mt={2} alignItems="center">
      <Input
        onChange={(e) => {
          onPropertyChange(mass.id, "hour", e.target.value);
        }}
        width={"10rem"}
        value={mass.hour}
        type="time"
      />
      <Checkbox
        mr={"1rem"}
        isChecked={mass.chapel}
        onChange={() => {
          onPropertyChange(mass.id, "chapel", !mass.chapel);
        }}
      >
        kaplica
      </Checkbox>
      <Autocomplete
        data={autocompleteData}
        value={mass.intention}
        highlight={mass.chapel}
        onChange={(value) => {
          onPropertyChange(mass.id, "intention", value);
        }}
      />
      <Button onClick={() => onDelete(mass.id)} colorScheme="red">
        -
      </Button>
    </Flex>
  );
}

export default Mass;
