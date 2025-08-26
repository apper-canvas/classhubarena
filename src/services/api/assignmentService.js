const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const assignmentService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "classId_c" } },
          { field: { Name: "title_c" } },
          { field: { Name: "totalPoints_c" } },
          { field: { Name: "dueDate_c" } },
          { field: { Name: "category_c" } }
        ]
      };
      
      const response = await apperClient.fetchRecords("assignment_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching assignments:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "classId_c" } },
          { field: { Name: "title_c" } },
          { field: { Name: "totalPoints_c" } },
          { field: { Name: "dueDate_c" } },
          { field: { Name: "category_c" } }
        ]
      };
      
      const response = await apperClient.getRecordById("assignment_c", id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching assignment with ID ${id}:`, error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async create(assignmentData) {
    try {
      const params = {
        records: [{
          classId_c: parseInt(assignmentData.classId_c || assignmentData.classId),
          title_c: assignmentData.title_c || assignmentData.title,
          totalPoints_c: parseInt(assignmentData.totalPoints_c || assignmentData.totalPoints),
          dueDate_c: assignmentData.dueDate_c || assignmentData.dueDate,
          category_c: assignmentData.category_c || assignmentData.category
        }]
      };
      
      const response = await apperClient.createRecord("assignment_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create assignment records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error("Error creating assignment:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async update(id, assignmentData) {
    try {
      const updateData = {
        Id: id
      };
      
      // Only include updateable fields
      if (assignmentData.classId_c !== undefined || assignmentData.classId !== undefined) {
        updateData.classId_c = parseInt(assignmentData.classId_c || assignmentData.classId);
      }
      if (assignmentData.title_c !== undefined || assignmentData.title !== undefined) {
        updateData.title_c = assignmentData.title_c || assignmentData.title;
      }
      if (assignmentData.totalPoints_c !== undefined || assignmentData.totalPoints !== undefined) {
        updateData.totalPoints_c = parseInt(assignmentData.totalPoints_c || assignmentData.totalPoints);
      }
      if (assignmentData.dueDate_c !== undefined || assignmentData.dueDate !== undefined) {
        updateData.dueDate_c = assignmentData.dueDate_c || assignmentData.dueDate;
      }
      if (assignmentData.category_c !== undefined || assignmentData.category !== undefined) {
        updateData.category_c = assignmentData.category_c || assignmentData.category;
      }
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord("assignment_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update assignment records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      console.error("Error updating assignment:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [id]
      };
      
      const response = await apperClient.deleteRecord("assignment_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete assignment records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulDeletions[0]?.data;
      }
    } catch (error) {
      console.error("Error deleting assignment:", error?.response?.data?.message || error.message);
      throw error;
    }
  }
};