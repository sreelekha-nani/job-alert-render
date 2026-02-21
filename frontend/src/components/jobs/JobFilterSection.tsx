import React from 'react'; // Removed useState and useEffect as filters are now passed as props
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface JobFilters {
  jobTitle: string;
  jobType: string;
  location: string;
  experienceLevel: string;
  salaryRange: string;
}

interface JobFilterSectionProps {
  filters: JobFilters; // Filters are now passed as props
  onFilterChange: (filters: JobFilters) => void;
  loading: boolean;
}

const filterOptions = {
  jobTitle: ["All", "Senior Software Engineer", "Full Stack Developer", "Frontend Engineer", "Backend Engineer", "DevOps Engineer", "Data Scientist", "Product Manager", "UX Designer", "QA Engineer", "ML Engineer"],
  jobType: ["All", "Full-time", "Part-time", "Contract", "Internship"],
  location: ["All", "Remote", "USA", "Bangalore", "Hyderabad", "Pune"],
  experienceLevel: ["All", "0-1 years", "1-3 years", "3-5 years", "5-8 years"],
  salaryRange: ["All", "3-5 LPA", "5-8 LPA", "8-12 LPA", "12-20 LPA", "20+ LPA"],
};

const JobFilterSection: React.FC<JobFilterSectionProps> = ({ filters, onFilterChange, loading }) => {
  
  // When a dropdown value changes, create a new filters object and call the parent's handler function
  const handleSelectChange = (filterName: keyof JobFilters, value: string) => {
    onFilterChange({
      ...filters,
      [filterName]: value,
    });
  };

  const selectClass = "bg-gray-700 text-white border-gray-600 focus:ring-purple-500 disabled:opacity-50";

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700 mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        
        {(Object.keys(filterOptions) as Array<keyof JobFilters>).map((key) => {
          const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
          return (
            <div key={key}>
              <Label htmlFor={key} className="block text-sm font-medium text-gray-300 mb-1">{label}</Label>
              <Select
                name={key}
                value={filters[key]} // Controlled component: value comes from props
                onValueChange={(value) => handleSelectChange(key, value)}
                disabled={loading}
              >
                <SelectTrigger id={key} className={selectClass}>
                  <SelectValue placeholder={`Select ${label}`} />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-gray-600">
                  {filterOptions[key].map(option => (
                    <SelectItem key={option} value={option} className="hover:bg-purple-500">
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default JobFilterSection;
