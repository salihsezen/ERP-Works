import { supabase } from './lib/supabase'

async function testDatabaseConnection() {
  try {
    console.log('Testing Supabase connection...')
    
    // Test a simple query to check if we can connect
    const { data, error } = await supabase
      .from('customers')
      .select('id')
      .limit(1)
    
    if (error) {
      console.error('Database connection error:', error)
      return { success: false, error }
    }
    
    console.log('Database connection successful!')
    console.log('Sample data:', data)
    return { success: true, data }
  } catch (err) {
    console.error('Unexpected error:', err)
    return { success: false, error: err }
  }
}

// Run the test
testDatabaseConnection().then(result => {
  console.log('Test result:', result)
})