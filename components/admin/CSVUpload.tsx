"use client";

import { useState, useRef } from "react";
import { Upload, X, Check, AlertCircle, FileText, Loader2 } from "lucide-react";

interface CSVUploadProps {
  onUpload: (data: any[]) => void;
  schema: { key: string; label: string; required?: boolean }[];
  templateFileName: string;
  title: string;
}

export default function CSVUpload({ onUpload, schema, templateFileName, title }: CSVUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (selectedFile: File) => {
    if (!selectedFile.name.endsWith(".csv")) {
      setErrors(["Please upload a valid CSV file."]);
      return;
    }

    setFile(selectedFile);
    setLoading(true);
    setErrors([]);

    try {
      const text = await selectedFile.text();
      const lines = text.trim().split("\n").filter(Boolean);
      if (lines.length < 2) {
        throw new Error("CSV file is empty or missing headers.");
      }

      const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/\s+/g, "_"));
      const data = lines.slice(1).map(line => {
        const values = line.split(",").map(v => v.trim());
        const obj: any = {};
        headers.forEach((h, i) => {
          // Map headers to schema keys if needed, but for now we assume headers match schema labels or keys
          const field = schema.find(s => s.label.toLowerCase() === h || s.key === h);
          if (field) {
            obj[field.key] = values[i] ?? "";
          }
        });
        return obj;
      });

      // Simple validation
      const validationErrors: string[] = [];
      data.forEach((row, index) => {
        schema.forEach(field => {
          if (field.required && !row[field.key]) {
            validationErrors.push(`Row ${index + 1}: Missing required field "${field.label}"`);
          }
        });
      });

      if (validationErrors.length > 0) {
        setErrors(validationErrors.slice(0, 5)); // Show only first 5 errors
        setPreview([]);
      } else {
        setPreview(data);
      }
    } catch (err: any) {
      setErrors([err.message]);
    } finally {
      setLoading(false);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const downloadTemplate = () => {
    const header = schema.map(s => s.label).join(",");
    const blob = new Blob([header], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = templateFileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">{title}</h3>
        <button 
          onClick={downloadTemplate}
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
        >
          <FileText className="w-3 h-3" /> Download Template
        </button>
      </div>

      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]); }}
          onClick={onButtonClick}
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
            dragActive ? "border-primary bg-primary/5" : "border-border/60 hover:border-primary/50 hover:bg-primary/5"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <Upload className="w-10 h-10 mx-auto mb-4 opacity-40 text-primary" />
          <p className="text-sm font-medium text-muted-foreground">
            Drop your CSV file here or <span className="text-primary">browse</span>
          </p>
          <p className="text-xs text-muted-foreground/60 mt-2">Max file size: 5MB</p>
        </div>
      ) : (
        <div className="glass rounded-2xl p-6 border border-primary/20 bg-primary/5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB • {preview.length} rows</p>
              </div>
            </div>
            <button 
              onClick={() => { setFile(null); setPreview([]); setErrors([]); }}
              className="p-1.5 rounded-full hover:bg-destructive/10 text-destructive transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}

          {errors.length > 0 && (
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 space-y-2">
              <div className="flex items-center gap-2 text-destructive font-bold text-sm">
                <AlertCircle className="w-4 h-4" /> Invalid CSV Data
              </div>
              <ul className="text-xs space-y-1 text-destructive/80 ml-6 list-disc">
                {errors.map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            </div>
          )}

          {preview.length > 0 && !loading && (
            <div className="space-y-4">
              <div className="max-h-40 overflow-y-auto rounded-xl border border-border/40 bg-background/50">
                <table className="w-full text-[10px] text-left">
                  <thead className="sticky top-0 bg-background border-b border-border/40">
                    <tr>
                      {schema.map(s => (
                        <th key={s.key} className="px-3 py-2 font-bold uppercase tracking-wider text-muted-foreground">{s.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.slice(0, 5).map((row, i) => (
                      <tr key={i} className="border-b border-border/20 last:border-0">
                        {schema.map(s => (
                          <td key={s.key} className="px-3 py-2 truncate max-w-[100px]">{row[s.key]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {preview.length > 5 && (
                <p className="text-center text-[10px] text-muted-foreground italic">
                  Showing first 5 of {preview.length} rows
                </p>
              )}
              <button 
                onClick={() => onUpload(preview)}
                className="w-full py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" /> Import {preview.length} Entries
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
