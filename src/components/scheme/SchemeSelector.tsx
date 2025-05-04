
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SchemeSelectorProps {
  selectedScheme: string;
  onSchemeSelect: (value: string) => void;
}

const SCHEMES = [
  { id: "scheme1", name: "PM Kisan Samman Nidhi" },
  { id: "scheme2", name: "Pradhan Mantri Awas Yojana" },
  { id: "scheme3", name: "Pradhan Mantri Jan Dhan Yojana" },
  { id: "scheme4", name: "Ayushman Bharat" },
  { id: "scheme5", name: "PM Garib Kalyan Yojana" },
];

const SchemeSelector = ({ selectedScheme, onSchemeSelect }: SchemeSelectorProps) => {
  return (
    <div className="space-y-2">
      <label htmlFor="scheme" className="form-label">Select Scheme</label>
      <Select onValueChange={onSchemeSelect} value={selectedScheme}>
        <SelectTrigger id="scheme">
          <SelectValue placeholder="Select a scheme" />
        </SelectTrigger>
        <SelectContent>
          {SCHEMES.map((scheme) => (
            <SelectItem key={scheme.id} value={scheme.id}>
              {scheme.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export { SCHEMES };
export default SchemeSelector;
