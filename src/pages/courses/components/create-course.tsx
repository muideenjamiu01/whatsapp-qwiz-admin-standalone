"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Save, X } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Label } from "../../../components/ui/label"
import { Input } from "../../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Textarea } from "../../../components/ui/textarea"
import { Switch } from "../../../components/ui/switch"


interface CreateCourseProps {
  onBack: () => void
  onSave: (courseData: any) => void
}

export default function CreateCourse({ onBack, onSave }: CreateCourseProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    joinCode: "",
    status: "draft",
    autoGenerateCode: true,
    allowSelfEnrollment: false,
    requireApproval: false,
    maxEnrollments: "",
    startDate: "",
    endDate: "",
    estimatedDuration: "",
    difficulty: "beginner",
    category: "onboarding",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const generateJoinCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    setFormData((prev) => ({ ...prev, joinCode: code }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Course title is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Course description is required"
    }

    if (!formData.joinCode.trim()) {
      newErrors.joinCode = "Join code is required"
    } else if (formData.joinCode.length < 4) {
      newErrors.joinCode = "Join code must be at least 4 characters"
    }

    if (formData.maxEnrollments && Number.parseInt(formData.maxEnrollments) < 1) {
      newErrors.maxEnrollments = "Max enrollments must be greater than 0"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSave(formData)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Course</h1>
              <p className="text-gray-600">Set up a new WhatsApp-based training course</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={onBack}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              <Save className="w-4 h-4 mr-2" />
              Create Course
            </Button>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Provide the essential details for your course</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Course Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Access Group Onboarding Experience"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="onboarding">Onboarding</SelectItem>
                      <SelectItem value="compliance">Compliance</SelectItem>
                      <SelectItem value="leadership">Leadership</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="soft-skills">Soft Skills</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this course covers and its objectives..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select value={formData.difficulty} onValueChange={(value) => handleInputChange("difficulty", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimatedDuration">Estimated Duration</Label>
                  <Input
                    id="estimatedDuration"
                    placeholder="e.g., 30 minutes"
                    value={formData.estimatedDuration}
                    onChange={(e) => handleInputChange("estimatedDuration", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Access Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Access Settings</CardTitle>
              <CardDescription>Configure how users can access this course</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="joinCode">Join Code *</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="joinCode"
                      placeholder="e.g., AGX2024"
                      value={formData.joinCode}
                      onChange={(e) => handleInputChange("joinCode", e.target.value.toUpperCase())}
                      className={errors.joinCode ? "border-red-500" : ""}
                      disabled={formData.autoGenerateCode}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={generateJoinCode}
                      disabled={formData.autoGenerateCode}
                    >
                      Generate
                    </Button>
                  </div>
                  {errors.joinCode && <p className="text-sm text-red-600">{errors.joinCode}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxEnrollments">Max Enrollments</Label>
                  <Input
                    id="maxEnrollments"
                    type="number"
                    placeholder="Leave empty for unlimited"
                    value={formData.maxEnrollments}
                    onChange={(e) => handleInputChange("maxEnrollments", e.target.value)}
                    className={errors.maxEnrollments ? "border-red-500" : ""}
                  />
                  {errors.maxEnrollments && <p className="text-sm text-red-600">{errors.maxEnrollments}</p>}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-generate Join Code</Label>
                    <p className="text-sm text-gray-600">Automatically generate a unique join code</p>
                  </div>
                  <Switch
                    checked={formData.autoGenerateCode}
                    onCheckedChange={(checked) => {
                      handleInputChange("autoGenerateCode", checked)
                      if (checked) {
                        generateJoinCode()
                      }
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Self-Enrollment</Label>
                    <p className="text-sm text-gray-600">Users can join using the join code without approval</p>
                  </div>
                  <Switch
                    checked={formData.allowSelfEnrollment}
                    onCheckedChange={(checked) => handleInputChange("allowSelfEnrollment", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Approval</Label>
                    <p className="text-sm text-gray-600">Admin approval required before users can start the course</p>
                  </div>
                  <Switch
                    checked={formData.requireApproval}
                    onCheckedChange={(checked) => handleInputChange("requireApproval", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Schedule</CardTitle>
              <CardDescription>Set availability dates for the course (optional)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange("startDate", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange("endDate", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Status */}
          <Card>
            <CardHeader>
              <CardTitle>Publication Status</CardTitle>
              <CardDescription>Choose the initial status for your course</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-600">
                  {formData.status === "draft"
                    ? "Course will be saved as draft and not visible to users"
                    : "Course will be immediately available to users"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onBack}>
              Cancel
            </Button>
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              Create Course
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
