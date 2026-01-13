import React, { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X, Loader } from 'lucide-react';

interface PrescriptionUploadProps {
    onPrescriptionExtracted: (medicines: string[]) => void;
}

const PrescriptionUpload: React.FC<PrescriptionUploadProps> = ({ onPrescriptionExtracted }) => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>('');
    const [uploading, setUploading] = useState(false);
    const [verified, setVerified] = useState(false);
    const [extractedMedicines, setExtractedMedicines] = useState<string[]>([]);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = async (selectedFile: File) => {
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
        if (!validTypes.includes(selectedFile.type)) {
            alert('Please upload a valid image (JPG, PNG) or PDF file');
            return;
        }

        if (selectedFile.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }

        setFile(selectedFile);

        if (selectedFile.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setPreview('');
        }

        await processFile(selectedFile);
    };

    const processFile = async (file: File) => {
        setUploading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));

            const mockMedicines = [
                'Temozolomide 250mg',
                'Bevacizumab 100mg',
                'Dexamethasone 4mg',
                'Levetiracetam 500mg'
            ];

            setExtractedMedicines(mockMedicines);
            setVerified(true);
            onPrescriptionExtracted(mockMedicines);
        } catch (error) {
            console.error('Error processing prescription:', error);
            alert('Failed to process prescription. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const removeFile = () => {
        setFile(null);
        setPreview('');
        setVerified(false);
        setExtractedMedicines([]);
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="text-[#4CC9F0]" />
                Upload Prescription
            </h3>

            {!file ? (
                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${dragActive
                            ? 'border-[#4CC9F0] bg-blue-50'
                            : 'border-gray-300 hover:border-[#4CC9F0]'
                        }`}
                >
                    <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-semibold text-gray-700 mb-2">
                        Drag & drop your prescription here
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                        or click to browse (JPG, PNG, PDF - Max 5MB)
                    </p>
                    <input
                        type="file"
                        id="prescription-upload"
                        className="hidden"
                        accept="image/jpeg,image/png,image/jpg,application/pdf"
                        onChange={handleFileInput}
                    />
                    <label
                        htmlFor="prescription-upload"
                        className="inline-block px-6 py-3 bg-gradient-to-r from-[#4CC9F0] to-[#2A9D8F] text-white rounded-xl font-bold cursor-pointer hover:shadow-lg transition-all"
                    >
                        Choose File
                    </label>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <FileText className="text-[#4CC9F0]" size={24} />
                                <div>
                                    <p className="font-semibold text-gray-900">{file.name}</p>
                                    <p className="text-sm text-gray-500">
                                        {(file.size / 1024).toFixed(2)} KB
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={removeFile}
                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                <X size={20} className="text-gray-600" />
                            </button>
                        </div>

                        {preview && (
                            <img
                                src={preview}
                                alt="Prescription preview"
                                className="w-full max-h-64 object-contain rounded-lg border border-gray-200"
                            />
                        )}

                        {uploading && (
                            <div className="flex items-center gap-2 mt-3 text-[#4CC9F0]">
                                <Loader className="animate-spin" size={20} />
                                <span className="font-medium">Processing prescription...</span>
                            </div>
                        )}

                        {verified && (
                            <div className="flex items-center gap-2 mt-3 text-green-600">
                                <CheckCircle size={20} />
                                <span className="font-medium">Prescription Verified</span>
                            </div>
                        )}
                    </div>

                    {extractedMedicines.length > 0 && (
                        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <CheckCircle className="text-green-600" size={20} />
                                Extracted Medicines ({extractedMedicines.length})
                            </h4>
                            <ul className="space-y-2">
                                {extractedMedicines.map((medicine, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center gap-2 text-gray-700 bg-white px-3 py-2 rounded-lg"
                                    >
                                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                                        {medicine}
                                    </li>
                                ))}
                            </ul>
                            <p className="text-sm text-gray-600 mt-3">
                                ✓ These medicines have been automatically added to your search
                            </p>
                        </div>
                    )}
                </div>
            )}

            <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-start gap-2">
                    <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
                    <div className="text-sm text-gray-700">
                        <p className="font-semibold mb-1">Important:</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>Ensure prescription is clear and readable</li>
                            <li>Doctor's signature and stamp must be visible</li>
                            <li>Prescription must be less than 6 months old</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrescriptionUpload;
