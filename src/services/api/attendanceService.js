const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const attendanceService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "studentId_c" } },
          { field: { Name: "classId_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "status_c" } }
        ]
      };
      
      const response = await apperClient.fetchRecords("attendance_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching attendance:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "studentId_c" } },
          { field: { Name: "classId_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "status_c" } }
        ]
      };
      
      const response = await apperClient.getRecordById("attendance_c", id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching attendance with ID ${id}:`, error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async create(attendanceData) {
    try {
      const params = {
        records: [{
          studentId_c: parseInt(attendanceData.studentId_c || attendanceData.studentId),
          classId_c: parseInt(attendanceData.classId_c || attendanceData.classId),
          date_c: attendanceData.date_c || attendanceData.date,
          status_c: attendanceData.status_c || attendanceData.status
        }]
      };
      
      const response = await apperClient.createRecord("attendance_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create attendance records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error("Error creating attendance:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async update(id, attendanceData) {
    try {
      const updateData = {
        Id: id
      };
      
      // Only include updateable fields
      if (attendanceData.studentId_c !== undefined || attendanceData.studentId !== undefined) {
        updateData.studentId_c = parseInt(attendanceData.studentId_c || attendanceData.studentId);
      }
      if (attendanceData.classId_c !== undefined || attendanceData.classId !== undefined) {
        updateData.classId_c = parseInt(attendanceData.classId_c || attendanceData.classId);
      }
      if (attendanceData.date_c !== undefined || attendanceData.date !== undefined) {
        updateData.date_c = attendanceData.date_c || attendanceData.date;
      }
      if (attendanceData.status_c !== undefined || attendanceData.status !== undefined) {
        updateData.status_c = attendanceData.status_c || attendanceData.status;
      }
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord("attendance_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update attendance records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      console.error("Error updating attendance:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [id]
      };
      
      const response = await apperClient.deleteRecord("attendance_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete attendance records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulDeletions[0]?.data;
      }
    } catch (error) {
      console.error("Error deleting attendance:", error?.response?.data?.message || error.message);
      throw error;
    }
  }
};