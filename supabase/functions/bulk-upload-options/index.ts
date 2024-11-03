import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import * as XLSX from 'https://deno.land/x/sheetjs/xlsx.mjs'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const gameId = formData.get('gameId') as string

    if (!file || !gameId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Read the Excel file
    const arrayBuffer = await file.arrayBuffer()
    const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' })
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const data = XLSX.utils.sheet_to_json(worksheet)

    console.log('Processing', data.length, 'options')

    const results = []
    for (const row of data) {
      try {
        const turnNumber = row['Turn Number']
        
        // Get or create turn
        let turn = await getTurn(supabase, gameId, turnNumber)
        if (!turn) {
          console.log('Creating new turn:', turnNumber)
          turn = await createTurn(supabase, gameId, turnNumber)
        }

        if (!turn) {
          throw new Error(`Failed to get or create turn ${turnNumber}`)
        }

        const optionData = {
          title: row['Title'],
          description: row['Description'],
          image: row['Image URL'],
          impactkpi1: row['KPI 1'],
          impactkpi1amount: parseFloat(row['KPI 1 Amount']) || 0,
          impactkpi2: row['KPI 2'],
          impactkpi2amount: parseFloat(row['KPI 2 Amount']) || 0,
          impactkpi3: row['KPI 3'],
          impactkpi3amount: parseFloat(row['KPI 3 Amount']) || 0,
          game_uuid: gameId,
          turn_uuid: turn.uuid,
          optionnumber: parseInt(row['Option Number']) || null
        }

        // If no option number provided, get next available
        if (!optionData.optionnumber) {
          const { data: existingOptions } = await supabase
            .from('Options')
            .select('optionnumber')
            .eq('turn_uuid', turn.uuid)
            .order('optionnumber', { ascending: false })
            .limit(1)

          optionData.optionnumber = existingOptions?.[0]?.optionnumber 
            ? existingOptions[0].optionnumber + 1 
            : 1
        }

        // Check if option exists
        const { data: existingOption } = await supabase
          .from('Options')
          .select('uuid')
          .eq('turn_uuid', turn.uuid)
          .eq('game_uuid', gameId)
          .eq('optionnumber', optionData.optionnumber)
          .single()

        let result
        if (existingOption) {
          const { data, error } = await supabase
            .from('Options')
            .update(optionData)
            .eq('uuid', existingOption.uuid)
            .select()
          
          if (error) throw error
          result = { status: 'updated', data }
        } else {
          const { data, error } = await supabase
            .from('Options')
            .insert([optionData])
            .select()

          if (error) throw error
          result = { status: 'inserted', data }
        }

        results.push({ 
          success: true, 
          turnNumber,
          optionNumber: optionData.optionnumber,
          ...result
        })
      } catch (error) {
        console.error('Error processing row:', error)
        results.push({ 
          success: false, 
          error: error.message,
          data: row 
        })
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Import completed', 
        results,
        totalProcessed: data.length,
        successful: results.filter(r => r.success).length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(
      JSON.stringify({ 
        error: 'An unexpected error occurred', 
        details: error.message
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

async function getTurn(supabase: any, gameId: string, turnNumber: number) {
  const { data } = await supabase
    .from('Turns')
    .select('*')
    .eq('game_uuid', gameId)
    .eq('turnnumber', turnNumber)
    .single()
  
  return data
}

async function createTurn(supabase: any, gameId: string, turnNumber: number) {
  const { data, error } = await supabase
    .from('Turns')
    .insert([{
      game_uuid: gameId,
      turnnumber: turnNumber,
    }])
    .select()
    .single()

  if (error) throw error
  return data
}