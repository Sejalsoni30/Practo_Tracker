import { supabase } from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Supabase error handling for finding one
    const { data: existingUser } = await supabase.from('users').select('*').eq('email', email).maybeSingle();
    
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const { data: savedUser, error } = await supabase.from('users').insert([{
      name,
      email,
      password: hashedPassword
    }]).select().single();

    if (error) throw error;

    res.status(201).json({ message: 'User registered successfully', userId: savedUser.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: user, error } = await supabase.from('users').select('*').eq('email', email).maybeSingle();
    if (!user || error) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get current logged-in user profile
export const getMe = async (req, res) => {
  try {
    const { data: user, error } = await supabase.from('users').select('id, name, email, created_at, updated_at').eq('id', req.user.id).single();
    if (error) throw error;
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};