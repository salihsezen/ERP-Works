import { supabase } from './lib/supabase'
import type { Database } from './types/supabase'

type TableName = keyof Database['public']['Tables']

async function testAllTables() {
  const tables: TableName[] = ['customers', 'employees', 'projects', 'vendors', 'purchase_orders', 'invoices']
  
  console.log('Testing Supabase database connection and table access...\n')
  
  for (const table of tables) {
    try {
      console.log(`Testing table: ${table}`)
      
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact' })
        .limit(1)
      
      if (error) {
        console.error(`Error accessing table '${table}':`, error.message)
        console.error('   Error details:', error)
      } else {
        console.log(`Table '${table}' accessible. Row count: ${count || 0}`)
        if (data && data.length > 0) {
          console.log('   Sample record:', JSON.stringify(data[0], null, 2))
        }
      }
      
      console.log('---')
    } catch (err) {
      console.error(`Unexpected error with table '${table}':`, err)
    }
  }
  
  console.log('\nDatabase test completed.')
}

testAllTables()
