import { Request, Response } from 'express';
import WasteHub from '../models/WasteHub';

/**
 * Module 1 - Member 1: Waste Hubs & Deposit Management
 * Users can find and filter waste disposal hubs by location and waste type
 */

// GET /api/waste-hubs - Get all waste hubs with optional filters
export const getAllWasteHubs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { wasteType, city, status } = req.query;

    // Build filter object
    const filter: any = {};

    if (wasteType) {
      filter.wasteTypes = wasteType;
    }

    if (city) {
      filter['location.city'] = { $regex: city, $options: 'i' }; // Case-insensitive search
    }

    if (status) {
      filter.status = status;
    }

    const hubs = await WasteHub.find(filter).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: hubs.length,
      data: hubs
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching waste hubs',
      error: error.message
    });
  }
};

// GET /api/waste-hubs/:id - Get single waste hub by ID
export const getWasteHubById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const hub = await WasteHub.findById(id);

    if (!hub) {
      res.status(404).json({
        success: false,
        message: 'Waste hub not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: hub
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching waste hub',
      error: error.message
    });
  }
};

// GET /api/waste-hubs/nearby - Find waste hubs near a location
export const getNearbyWasteHubs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { lat, lng, maxDistance = 10000, wasteType } = req.query;

    if (!lat || !lng) {
      res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
      return;
    }

    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);
    const distance = parseInt(maxDistance as string);

    // Find all hubs
    let query: any = {};
    if (wasteType) {
      query.wasteTypes = wasteType;
    }
    
    const allHubs = await WasteHub.find(query);
    
    // Calculate distance for each hub using Haversine formula
    const hubsWithDistance = allHubs.map(hub => {
      const hubLat = hub.location.coordinates.latitude;
      const hubLng = hub.location.coordinates.longitude;
      
      const R = 6371e3; // Earth's radius in meters
      const φ1 = latitude * Math.PI / 180;
      const φ2 = hubLat * Math.PI / 180;
      const Δφ = (hubLat - latitude) * Math.PI / 180;
      const Δλ = (hubLng - longitude) * Math.PI / 180;
      
      const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const calculatedDistance = R * c;
      
      return {
        ...hub.toJSON(),
        distanceInMeters: Math.round(calculatedDistance),
        distanceInKm: parseFloat((calculatedDistance / 1000).toFixed(2))
      };
    });
    
    // Filter by distance and sort
    const nearbyHubs = hubsWithDistance
      .filter(hub => hub.distanceInMeters <= distance)
      .sort((a, b) => a.distanceInMeters - b.distanceInMeters)
      .slice(0, 20);

    res.status(200).json({
      success: true,
      count: nearbyHubs.length,
      searchRadius: `${distance / 1000} km`,
      data: nearbyHubs
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error finding nearby waste hubs',
      error: error.message
    });
  }
};

// GET /api/waste-hubs/filter?wasteType=Plastic - Filter hubs by waste type
export const filterHubsByWasteType = async (req: Request, res: Response): Promise<void> => {
  try {
    const { wasteType, status, city } = req.query;

    if (!wasteType) {
      res.status(400).json({
        success: false,
        message: 'wasteType query parameter is required'
      });
      return;
    }

    const filter: any = {
      wasteTypes: wasteType
    };

    if (status) {
      filter.status = status;
    }

    if (city) {
      filter['location.city'] = { $regex: city, $options: 'i' };
    }

    const hubs = await WasteHub.find(filter).sort({ name: 1 });

    res.status(200).json({
      success: true,
      wasteType,
      count: hubs.length,
      data: hubs
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error filtering waste hubs',
      error: error.message
    });
  }
};

// GET /api/waste-hubs/status?status=active - Get hubs by status (open/closed/maintenance)
export const getHubsByStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.query;

    if (!status) {
      res.status(400).json({
        success: false,
        message: 'status query parameter is required'
      });
      return;
    }

    const statusValue = status as string;
    if (!['open', 'closed', 'maintenance'].includes(statusValue)) {
      res.status(400).json({
        success: false,
        message: 'Invalid status. Use: open, closed, or maintenance'
      });
      return;
    }

    const hubs = await WasteHub.find({ status: statusValue }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      status,
      count: hubs.length,
      data: hubs
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching hubs by status',
      error: error.message
    });
  }
};

// GET /api/waste-hubs/:id/accepted-materials - Get accepted materials and pricing for a hub
export const getAcceptedMaterials = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const hub = await WasteHub.findById(id, 'name acceptedMaterials');

    if (!hub) {
      res.status(404).json({
        success: false,
        message: 'Waste hub not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      hubName: hub.name,
      acceptedMaterials: hub.acceptedMaterials
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching accepted materials',
      error: error.message
    });
  }
};
