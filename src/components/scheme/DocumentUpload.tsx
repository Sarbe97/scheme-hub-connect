
import { ChangeEvent } from "react";
import { File, X, Upload } from "lucide-react";

interface DocumentUploadProps {
  documents: File[];
  onFileUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemoveDocument: (index: number) => void;
}

const DocumentUpload = ({ documents, onFileUpload, onRemoveDocument }: DocumentUploadProps) => {
  return (
    <div className="space-y-2">
      <label htmlFor="documents" className="form-label">Upload Documents</label>
      <div className="flex items-center justify-center w-full">
        <label htmlFor="documents" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-secondary hover:bg-secondary/80">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-2 text-accent" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              PDF, PNG, JPG (MAX. 10MB per file)
            </p>
          </div>
          <input 
            id="documents" 
            type="file" 
            className="hidden" 
            onChange={onFileUpload} 
            multiple
          />
        </label>
      </div>

      {documents.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Uploaded Documents</h3>
          <ul className="space-y-2">
            {documents.map((file, index) => (
              <li key={index} className="flex justify-between items-center p-2 bg-secondary rounded-md">
                <div className="flex items-center space-x-2">
                  <File className="h-4 w-4 text-accent" />
                  <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => onRemoveDocument(index)}
                  className="text-gray-500 hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
