import { Request, Response } from "express";
import logger from "../utils/logger";
import  ConstantsModel from "../models/constants.model";
import {ConstantsZodSchema}  from "../schema/constants.schema"

export async function createConstantHandler(req: Request, res: Response) {
  try {
    const constantInstance = await ConstantsModel.create(req.body);
    res.status(201).json(constantInstance);
  } catch (error: any) {
    logger.error(error);
    res.status(400).json({ name: error.name, message: error.message });
  }
}

export async function updateConstantByNameHandler(req: Request, res: Response) {
  try {
    const constantName = req.body.constantName;
    const updateData = req.body;
    const existingConstant = await ConstantsModel.findOne({ constantName });
    if (!existingConstant) {
      return res.status(404).json({ error: 'Constant not found' });
    }

    const updatedConstant = await ConstantsModel.findOneAndUpdate({ constantName }, {$set:updateData}, { new: true });

    if (!updatedConstant) {
      return res.status(500).json({ error: 'Failed to update constant' });
    }

    return res.status(200).json(updatedConstant);
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteConstantByNameHandler(req: Request, res: Response) {
  try {
    const constantName = req.body.constantName;

    const deletedConstant = await ConstantsModel.findOneAndDelete({ constantName });

    if (!deletedConstant) {
      return res.status(404).json({ error: 'Constant not found' });
    }

    return res.sendStatus(200);
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getConstantByNameHandler(req: Request, res: Response) {
  try {
    const constantName = req.params.name;

    const constant = await ConstantsModel.findOne({ constantName });

    if (!constant) {
      return res.status(404).json({ error: 'Constant not found' });
    }

    return res.status(200).json(constant);
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


export async function getAllConstantsHandler(req: Request, res: Response) {
  try {
    const constants = await ConstantsModel.find();
    
    return res.status(200).json(constants);
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
