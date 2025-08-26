const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const classService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "name_c" } },
          { field: { Name: "subject_c" } },
          { field: { Name: "period_c" } },
          { field: { Name: "room_c" } }
        ]
      };
      
      const response = await apperClient.fetchRecords("class_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching classes:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "name_c" } },
          { field: { Name: "subject_c" } },
          { field: { Name: "period_c" } },
          { field: { Name: "room_c" } }
        ]
      };
      
      const response = await apperClient.getRecordById("class_c", id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching class with ID ${id}:`, error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async create(classData) {
    try {
      const params = {
        records: [{
          name_c: classData.name_c || classData.name,
          subject_c: classData.subject_c || classData.subject,
          period_c: classData.period_c || classData.period,
          room_c: classData.room_c || classData.room
        }]
      };
      
      const response = await apperClient.createRecord("class_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create class records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error("Error creating class:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async update(id, classData) {
    try {
      const updateData = {
        Id: id
      };
      
      // Only include updateable fields
      if (classData.name_c !== undefined || classData.name !== undefined) {
        updateData.name_c = classData.name_c || classData.name;
      }
      if (classData.subject_c !== undefined || classData.subject !== undefined) {
        updateData.subject_c = classData.subject_c || classData.subject;
      }
      if (classData.period_c !== undefined || classData.period !== undefined) {
        updateData.period_c = classData.period_c || classData.period;
      }
      if (classData.room_c !== undefined || classData.room !== undefined) {
        updateData.room_c = classData.room_c || classData.room;
      }
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord("class_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update class records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      console.error("Error updating class:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [id]
      };
      
      const response = await apperClient.deleteRecord("class_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete class records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulDeletions[0]?.data;
      }
    } catch (error) {
      console.error("Error deleting class:", error?.response?.data?.message || error.message);
      throw error;
    }
  }
};