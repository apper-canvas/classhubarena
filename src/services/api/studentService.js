const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const studentService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "firstName_c" } },
          { field: { Name: "lastName_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "classId_c" } },
          { field: { Name: "enrollmentDate_c" } },
          { field: { Name: "status_c" } }
        ]
      };
      
      const response = await apperClient.fetchRecords("student_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching students:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "firstName_c" } },
          { field: { Name: "lastName_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "classId_c" } },
          { field: { Name: "enrollmentDate_c" } },
          { field: { Name: "status_c" } }
        ]
      };
      
      const response = await apperClient.getRecordById("student_c", id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching student with ID ${id}:`, error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async create(studentData) {
    try {
      const params = {
        records: [{
          firstName_c: studentData.firstName_c,
          lastName_c: studentData.lastName_c,
          email_c: studentData.email_c,
          grade_c: studentData.grade_c,
          classId_c: parseInt(studentData.classId_c),
          enrollmentDate_c: studentData.enrollmentDate_c || new Date().toISOString().split('T')[0],
          status_c: studentData.status_c || "Active"
        }]
      };
      
      const response = await apperClient.createRecord("student_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create student records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error("Error creating student:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async update(id, studentData) {
    try {
      const updateData = {
        Id: id
      };
      
      // Only include updateable fields
      if (studentData.firstName_c !== undefined) updateData.firstName_c = studentData.firstName_c;
      if (studentData.lastName_c !== undefined) updateData.lastName_c = studentData.lastName_c;
      if (studentData.email_c !== undefined) updateData.email_c = studentData.email_c;
      if (studentData.grade_c !== undefined) updateData.grade_c = studentData.grade_c;
      if (studentData.classId_c !== undefined) updateData.classId_c = parseInt(studentData.classId_c);
      if (studentData.enrollmentDate_c !== undefined) updateData.enrollmentDate_c = studentData.enrollmentDate_c;
      if (studentData.status_c !== undefined) updateData.status_c = studentData.status_c;
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord("student_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update student records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      console.error("Error updating student:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [id]
      };
      
      const response = await apperClient.deleteRecord("student_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete student records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulDeletions[0]?.data;
      }
    } catch (error) {
      console.error("Error deleting student:", error?.response?.data?.message || error.message);
      throw error;
    }
  }
};