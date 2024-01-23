import { Select, Flex, Checkbox, Tooltip } from "@chakra-ui/react";
import { Path } from "../paths";
import { useState } from "react";

interface Props {
  currentPath?: Path;
  availablePaths: Path[];
  onPathChange: (path: Path | null) => void;
  date: Date;
  reverse: boolean;
}

function PathPicker({
  currentPath,
  availablePaths,
  onPathChange,
  date,
  reverse,
}: Props) {
  const [allowLongOverride, setAllowLongOverride] = useState<boolean | null>(
    currentPath?.isLong ? true : null
  );

  const [isOpen, setIsOpen] = useState(false);

  const allowLong = allowLongOverride ?? date.getDay() === 6;

  const longPaths = availablePaths.filter((path) => path.isLong);
  const shortPaths = availablePaths.filter((path) => !path.isLong);

  const direction = reverse ? "reversed" : "normal";

  return (
    <Flex flexGrow={1} gap={2}>
      <Select
        onChange={({ target: { value } }) => {
          const pickedPath = availablePaths.find(
            (path) => path.id === parseInt(value)
          );
          onPathChange(pickedPath || null);
        }}
        value={currentPath?.id}
        placeholder="Wybierz trasę"
      >
        {currentPath && (
          <option value={currentPath.id}>
            {currentPath.streets[direction]}
          </option>
        )}
        {allowLong && (
          <option disabled value={""}>
            --Długie trasy--
          </option>
        )}
        {allowLong &&
          longPaths.map((path) => (
            <option key={path.id} value={path.id}>
              {path.streets[direction]}
            </option>
          ))}
        <option disabled value={""}>
          --Krótkie trasy--
        </option>
        {shortPaths.map((path) => (
          <option key={path.id} value={path.id}>
            {path.streets[direction]}
          </option>
        ))}
      </Select>
      <Tooltip margin={5} isOpen={isOpen} label="Pozwalaj wybrać długą trasę!">
        <Checkbox
          onPointerEnter={() => setIsOpen(true)}
          onPointerLeave={() => setIsOpen(false)}
          isChecked={allowLong}
          onChange={() => setAllowLongOverride(!allowLong)}
        />
      </Tooltip>
    </Flex>
  );
}

export default PathPicker;
