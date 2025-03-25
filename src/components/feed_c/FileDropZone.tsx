import { useState } from "react";

export default function FileDropZone({ onFilesSelected }) {
  const [dragging, setDragging] = useState(false);
  const [hasFile, setHasFile] = useState(false);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    onFilesSelected(files);
    setHasFile(files.length > 0);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    onFilesSelected(files);
    setHasFile(files.length > 0);
    setDragging(false);
  };

  return (
    <label
      className={`boder-gray-800 text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:boder-gray-100 text-sm border-2 border-dashed mt-2 px-4 py-2 rounded-md cursor-pointer transition-all ${
        dragging ? "border-blue-500 bg-blue-100" : "border-gray-400"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {dragging
        ? "Arrastra y suelta"
        : hasFile
        ? "Selecciona un archivo"
        : "Selecciona un archivo"}

      <input
        type="file"
        className="hidden"
        multiple
        onChange={handleFileChange}
        accept=".pdf,image/*,video/*"
      />
    </label>
  );
}
