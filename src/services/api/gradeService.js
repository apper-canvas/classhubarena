const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const gradeService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "studentId_c" } },
          { field: { Name: "assignmentId_c" } },
          { field: { Name: "score_c" } },
          { field: { Name: "submittedDate_c" } }
        ]
      };
      
      const response = await apperClient.fetchRecords("grade_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching grades:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "studentId_c" } },
          { field: { Name: "assignmentId_c" } },
          { field: { Name: "score_c" } },
          { field: { Name: "submittedDate_c" } }
        ]
      };
      
      const response = await apperClient.getRecordById("grade_c", id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching grade with ID ${id}:`, error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async create(gradeData) {
    try {
      const params = {
        records: [{
          studentId_c: parseInt(gradeData.studentId_c || gradeData.studentId),
          assignmentId_c: parseInt(gradeData.assignmentId_c || gradeData.assignmentId),
          score_c: parseFloat(gradeData.score_c || gradeData.score),
          submittedDate_c: gradeData.submittedDate_c || gradeData.submittedDate || new Date().toISOString()
        }]
      };
      
      const response = await apperClient.createRecord("grade_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create grade records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error("Error creating grade:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async update(id, gradeData) {
    try {
      const updateData = {
        Id: id
      };
      
      // Only include updateable fields
      if (gradeData.studentId_c !== undefined || gradeData.studentId !== undefined) {
        updateData.studentId_c = parseInt(gradeData.studentId_c || gradeData.studentId);
      }
      if (gradeData.assignmentId_c !== undefined || gradeData.assignmentId !== undefined) {
        updateData.assignmentId_c = parseInt(gradeData.assignmentId_c || gradeData.assignmentId);
      }
      if (gradeData.score_c !== undefined || gradeData.score !== undefined) {
        updateData.score_c = parseFloat(gradeData.score_c || gradeData.score);
      }
      if (gradeData.submittedDate_c !== undefined || gradeData.submittedDate !== undefined) {
        updateData.submittedDate_c = gradeData.submittedDate_c || gradeData.submittedDate;
      }
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord("grade_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update grade records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      console.error("Error updating grade:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [id]
      };
      
      const response = await apperClient.deleteRecord("grade_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete grade records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulDeletions[0]?.data;
      }
    } catch (error) {
      console.error("Error deleting grade:", error?.response?.data?.message || error.message);
      throw error;
    }
  }
};