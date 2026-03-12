import clientModel from "../modeles/client.modele.js";

// Add Client
export const addClient = async (req, res) => {
  try {
    const { fullName, phoneNumber, drivingLicenseNumber, nationalId, address } = req.body;

    // Validation
    if (!fullName || !phoneNumber || !drivingLicenseNumber || !nationalId || !address) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // Check if client already exists
    const existingClient = await clientModel.findOne({
      $or: [
        { nationalId },
        { drivingLicenseNumber }
      ]
    });

    if (existingClient) {
      return res.status(400).json({
        message: "Client with this National ID or License already exists"
      });
    }

    // Create new client
    const newClient = await clientModel.create({
      createdBy: req.user.id,
      fullName,
      phoneNumber,
      drivingLicenseNumber,
      nationalId,
      address
    });

    res.status(201).json({
      message: "Client added successfully",
      client: newClient
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Get All Clients (for logged in admin)
export const getClients = async (req, res) => {
  try {
    const clients = await clientModel.find({ createdBy: req.user.id })
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Get Single Client
export const getClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await clientModel.findOne({ _id: id, createdBy: req.user.id });
    
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    
    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Update Client
export const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, phoneNumber, drivingLicenseNumber, nationalId, address } = req.body;

    // Validation
    if (!fullName || !phoneNumber || !drivingLicenseNumber || !nationalId || !address) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // Check if another client has same nationalId or license
    const existingClient = await clientModel.findOne({
      _id: { $ne: id },
      $or: [
        { nationalId },
        { drivingLicenseNumber }
      ]
    });

    if (existingClient) {
      return res.status(400).json({
        message: "Another client with this National ID or License already exists"
      });
    }

    const updatedClient = await clientModel.findOneAndUpdate(
      { _id: id, createdBy: req.user.id },
      {
        fullName,
        phoneNumber,
        drivingLicenseNumber,
        nationalId,
        address
      },
      { new: true }
    );

    if (!updatedClient) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json({
      message: "Client updated successfully",
      client: updatedClient
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Delete Client
export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedClient = await clientModel.findOneAndDelete({ 
      _id: id, 
      createdBy: req.user.id 
    });

    if (!deletedClient) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json({
      message: "Client deleted successfully",
      client: deletedClient
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};