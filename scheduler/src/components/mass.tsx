import { Button, Checkbox, Flex, Input, Textarea } from "@chakra-ui/react";
import { Mass as MassType } from "../utils/massUtils";

interface Props {
  mass: MassType;
  onDelete: (massId: number) => void;
  onPropertyChange: (
    massId: number,
    propertyName: string,
    newValue: string | boolean
  ) => void;
}

function Mass({ mass, onPropertyChange, onDelete }: Props) {
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
      <Textarea
        flexGrow={1}
        value={mass.intention}
        onChange={(e) => {
          onPropertyChange(mass.id, "intention", e.target.value);
        }}
      />
      <Button onClick={() => onDelete(mass.id)} colorScheme="red">
        -
      </Button>
    </Flex>
  );
}

export default Mass;
