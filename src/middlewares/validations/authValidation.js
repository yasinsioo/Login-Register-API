const joi = require('joi');
const APIError = require('../../utils/errors.js');

class authValidation {
  constructor() {}
  static register = async (req, res, next) => {
    try {
      await joi
        .object({
          name: joi.string().trim().min(3).max(100).required().messages({
            'string.base': 'Please check your name.',
            'string.empty': 'Name field cannot be empty.',
            'string.min': 'Name must be at least 3 characters.',
            'string.max': 'Name cannot be more than 100 characters.',
            'string.required': 'Name is required.',
          }),
          lastname: joi.string().trim().min(3).max(100).required().messages({
            'string.base': 'Please check your Lastname.',
            'string.empty': 'Lastname field cannot be empty.',
            'string.min': 'Lastname must be at least 3 characters.',
            'string.max': 'Lastname cannot be more than 100 characters.',
            'string.required': 'Lastname is required.',
          }),
          email: joi
            .string()
            .email()
            .trim()
            .min(3)
            .max(100)
            .required()
            .messages({
              'string.base': 'Please check your email.',
              'string.email': 'Please put an correct email.',
              'string.empty': 'Email field cannot be empty.',
              'string.min': 'Email must be at least 3 characters.',
              'string.max': 'Email cannot be more than 100 characters.',
              'string.required': 'Email is required.',
            }),
          password: joi.string().trim().min(6).max(36).required().messages({
            'string.base': 'Please check your password.',
            'string.empty': 'Password field cannot be empty.',
            'string.min': 'Password must be at least 6 characters.',
            'string.max': 'Password cannot be more than 36 characters.',
            'string.required': 'Password is required.',
          }),
        })
        .validateAsync(req.body);
    } catch (error) {
      throw new APIError(error.details[0].message, 400);
    }
    next();
  };

  static login = async (req, res, next) => {
    try {
      await joi
        .object({
          email: joi
            .string()
            .email()
            .trim()
            .min(3)
            .max(100)
            .required()
            .messages({
              'string.base': 'Please check your email.',
              'string.email': 'Please put an correct email.',
              'string.empty': 'Email field cannot be empty.',
              'string.min': 'Email must be at least 3 characters.',
              'string.max': 'Email cannot be more than 100 characters.',
              'string.required': 'Email is required.',
            }),
          password: joi.string().trim().min(6).max(36).required().messages({
            'string.base': 'Please check your password.',
            'string.empty': 'Password field cannot be empty.',
            'string.min': 'Password must be at least 6 characters.',
            'string.max': 'Password cannot be more than 36 characters.',
            'string.required': 'Password is required.',
          }),
        })
        .validateAsync(req.body);
    } catch (error) {
      throw new APIError(error.details[0].message, 400);
    }
    next();
  };
}

module.exports = authValidation;
