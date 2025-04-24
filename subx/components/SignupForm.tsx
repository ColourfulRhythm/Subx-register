import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Modal,
  Pressable
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/store/userStore';
import { colors } from '@/constants/colors';
import { incomeRanges } from '@/constants/incomeRanges';
import * as Haptics from 'expo-haptics';

type FormData = {
  fullName: string;
  email: string;
  phoneNumber: string;
  incomeRange: string;
};

type FormErrors = {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  incomeRange?: string;
  form?: string;
};

export const SignupForm = () => {
  const router = useRouter();
  const addUser = useUserStore(state => state.addUser);
  
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    incomeRange: '50000-100000',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10,15}$/.test(formData.phoneNumber.replace(/[^0-9]/g, ''))) {
      newErrors.phoneNumber = 'Phone number is invalid';
    }
    
    if (!formData.incomeRange) {
      newErrors.incomeRange = 'Income range is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        addUser(formData);
        router.push('/success');
      } catch (error) {
        console.error('Error submitting form:', error);
        setErrors({ ...errors, form: 'An error occurred. Please try again.' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Find the selected income range label
  const selectedIncomeRangeLabel = incomeRanges.find(
    option => option.value === formData.incomeRange
  )?.label || '';
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingView}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={[styles.input, errors.fullName ? styles.inputError : null]}
              placeholder="Enter your full name"
              value={formData.fullName}
              onChangeText={(text) => setFormData({ ...formData, fullName: text })}
              autoCapitalize="words"
            />
            {errors.fullName ? <Text style={styles.errorText}>{errors.fullName}</Text> : null}
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={[styles.input, errors.email ? styles.inputError : null]}
              placeholder="Enter your email address"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={[styles.input, errors.phoneNumber ? styles.inputError : null]}
              placeholder="Enter your phone number"
              value={formData.phoneNumber}
              onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
              keyboardType="phone-pad"
            />
            {errors.phoneNumber ? <Text style={styles.errorText}>{errors.phoneNumber}</Text> : null}
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Income Range</Text>
            {Platform.OS === 'web' ? (
              <View style={[styles.input, styles.pickerContainer]}>
                <select
                  style={styles.webPicker}
                  value={formData.incomeRange}
                  onChange={(e) => setFormData({ ...formData, incomeRange: e.target.value })}
                >
                  {incomeRanges.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </View>
            ) : Platform.OS === 'ios' ? (
              <>
                <TouchableOpacity 
                  style={[styles.input, styles.pickerButton]} 
                  onPress={() => setShowPicker(true)}
                >
                  <Text style={styles.pickerButtonText}>
                    {selectedIncomeRangeLabel || 'Select an income range'}
                  </Text>
                </TouchableOpacity>
                
                <Modal
                  visible={showPicker}
                  transparent={true}
                  animationType="slide"
                >
                  <View style={styles.modalContainer}>
                    <View style={styles.pickerModalContent}>
                      <View style={styles.pickerHeader}>
                        <TouchableOpacity 
                          style={styles.pickerDoneButton} 
                          onPress={() => setShowPicker(false)}
                        >
                          <Text style={styles.pickerDoneButtonText}>Done</Text>
                        </TouchableOpacity>
                      </View>
                      
                      <Picker
                        selectedValue={formData.incomeRange}
                        onValueChange={(itemValue) => setFormData({ ...formData, incomeRange: itemValue })}
                        style={styles.iosPicker}
                      >
                        {incomeRanges.map((option) => (
                          <Picker.Item 
                            key={option.value} 
                            label={option.label} 
                            value={option.value} 
                          />
                        ))}
                      </Picker>
                    </View>
                  </View>
                </Modal>
              </>
            ) : (
              <View style={[styles.input, styles.pickerContainer]}>
                <Picker
                  selectedValue={formData.incomeRange}
                  onValueChange={(itemValue) => setFormData({ ...formData, incomeRange: itemValue })}
                  style={styles.picker}
                  mode="dropdown"
                >
                  {incomeRanges.map((option) => (
                    <Picker.Item key={option.value} label={option.label} value={option.value} />
                  ))}
                </Picker>
              </View>
            )}
            {errors.incomeRange ? <Text style={styles.errorText}>{errors.incomeRange}</Text> : null}
          </View>
          
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color={colors.buttonText} />
            ) : (
              <Text style={styles.buttonText}>Join Now – Reserve My Spot</Text>
            )}
          </TouchableOpacity>
          
          {errors.form ? <Text style={[styles.errorText, styles.formError]}>{errors.form}</Text> : null}
          
          <Text style={styles.disclaimer}>
            You'll receive project updates, exclusive invites, and early investment opportunities.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.text,
  },
  input: {
    backgroundColor: colors.inputBackground,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  formError: {
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  pickerContainer: {
    padding: 0,
    height: 50,
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
    height: 50,
  },
  webPicker: {
    width: '100%',
    height: '100%',
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: 16,
  },
  pickerButton: {
    justifyContent: 'center',
  },
  pickerButtonText: {
    fontSize: 16,
    color: colors.text,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  pickerModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingBottom: 20,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  pickerDoneButton: {
    padding: 4,
  },
  pickerDoneButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  iosPicker: {
    width: '100%',
    height: 200,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: 'bold',
  },
  disclaimer: {
    marginTop: 16,
    textAlign: 'center',
    color: colors.lightText,
    fontSize: 14,
  },
});