'use client';

import { useState } from 'react';
import {
  Box,
  TextField,
  Grid,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export default function BusinessInformation() {
  const [formData, setFormData] = useState({
    legalBusinessName: '',
    businessFoundedDate: null,
    primaryBusinessAddress: '',
    primaryBusinessPhone: '',
    businessHours: '',
    businessWebsite: '',
    businessAdminEmail: '',
    businessSupportEmail: '',
    businessType: '',
    primaryContact: '',
    secondaryContact: '',
    customerPortal: '',
  });

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Business Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            label="Legal Business Name"
            value={formData.legalBusinessName}
            onChange={handleChange('legalBusinessName')}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Business Founded Date"
              value={formData.businessFoundedDate}
              onChange={(newValue) => setFormData({ ...formData, businessFoundedDate: newValue })}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Primary Business Address"
            value={formData.primaryBusinessAddress}
            onChange={handleChange('primaryBusinessAddress')}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            label="Primary Business Phone Number"
            value={formData.primaryBusinessPhone}
            onChange={handleChange('primaryBusinessPhone')}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            label="Business Hours"
            value={formData.businessHours}
            onChange={handleChange('businessHours')}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Business Website"
            value={formData.businessWebsite}
            onChange={handleChange('businessWebsite')}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            label="Business Admin Email"
            type="email"
            value={formData.businessAdminEmail}
            onChange={handleChange('businessAdminEmail')}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Business Support Email"
            type="email"
            value={formData.businessSupportEmail}
            onChange={handleChange('businessSupportEmail')}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth required>
            <InputLabel>Business Type</InputLabel>
            <Select
              value={formData.businessType}
              label="Business Type"
              onChange={handleChange('businessType')}
            >
              <MenuItem value="service">Service Area</MenuItem>
              <MenuItem value="physical">Physical Location</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            label="Primary Business Point of Contact"
            value={formData.primaryContact}
            onChange={handleChange('primaryContact')}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Secondary Business Point of Contact"
            value={formData.secondaryContact}
            onChange={handleChange('secondaryContact')}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Customer Portal URL"
            value={formData.customerPortal}
            onChange={handleChange('customerPortal')}
          />
        </Grid>
      </Grid>
    </Box>
  );
} 