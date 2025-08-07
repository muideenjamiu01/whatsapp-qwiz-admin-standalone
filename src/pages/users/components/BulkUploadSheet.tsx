import { useRef, useState } from "react";
import { Upload, Download, FileText, Users } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../../../components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { coursesApi } from "../../../hooks/useCourses";


interface BulkUploadSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFileUpload: (file: File, courseId: string) => void;
  isUploading?: boolean;
}

export function BulkUploadSheet({ open, onOpenChange, onFileUpload, isUploading = false }: BulkUploadSheetProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!selectedCourseId) {
      // This shouldn't happen due to disabled state, but just in case
      return;
    }
    
    onFileUpload(file, selectedCourseId);
  };

  const {
    data: courses,
  } = useQuery({
    queryKey: ["getAllCourses", 1, 100, "", ""],
    queryFn: () =>
      coursesApi.getAllCourses({
        pageNumber: 1,
        pageSize: 100,
        searchTerm: "",
        status: "",
      }),
    staleTime: 1000 * 60 * 60,
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:w-[800px] flex flex-col">
        <SheetHeader className="pb-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <SheetTitle className="text-xl font-semibold text-gray-900">
                Bulk Upload Users
              </SheetTitle>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 p-4 pb-4 space-y-6">
          {/* Instructions Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-blue-900 mb-2">How it works</h3>
                <p className="text-sm text-blue-700 leading-relaxed">
                  Upload a CSV file containing user information. Make sure your file follows the correct format by downloading our sample template first.
                </p>
              </div>
            </div>
          </div>

          {/* Template Download */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Step 1: Download Template</h4>
            <a
              href="/assets/users_template.xlsx"
              download
              className="inline-flex items-center px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors duration-200 group"
            >
              <Download className="w-4 h-4 mr-2 text-gray-500 group-hover:text-gray-700" />
              Download Excel Template
            </a>
            <p className="text-xs text-gray-500">
              Use this template to ensure your data is formatted correctly
            </p>
          </div>

          {/* File Upload */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Step 2: Select Course</h4>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Select the course you're adding users to <span className="text-red-500">*</span>
              </label>
              <Select
                value={selectedCourseId}
                onValueChange={setSelectedCourseId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent >
                  {courses?.data?.courses?.map((course: any) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <h4 className="font-medium text-gray-900 mt-4">Step 3: Upload Your File</h4>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 text-center hover:border-gray-400 transition-colors duration-200">
              <div className="space-y-3">
                {/* <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <Upload className="w-6 h-6 text-gray-400" />
                </div> */}
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    Choose your Excel or CSV file
                  </p>
                  <p className="text-xs text-gray-500">
                    Supports Excel (.xlsx) and CSV files up to 10MB
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-3"
                  disabled={!selectedCourseId || isUploading}
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Select File
                    </>
                  )}
                </Button>
                {!selectedCourseId && (
                  <p className="text-xs text-red-500 mt-2">
                    Please select a course before uploading
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-medium text-amber-900 mb-2">Requirements</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• File must be in Excel (.xlsx) or CSV format</li>
              <li>• Maximum file size: 10MB</li>
              
            </ul>
          </div>
        </div>

        <input
          type="file"
          accept=".csv,.xlsx"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          disabled={!selectedCourseId || isUploading}
        />
      </SheetContent>
    </Sheet>
  );
}