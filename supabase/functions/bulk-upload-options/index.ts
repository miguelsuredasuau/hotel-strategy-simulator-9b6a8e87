import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import * as XLSX from 'https://deno.land/x/sheetjs/xlsx.mjs'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const turnId = formData.get('turnId') as string
    const gameId = formData.get('gameId') as string

    console.log('Received request:', { turnId, gameId, fileName: file?.name })

    if (!file || !turnId || !gameId) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields',
          received: { file: !!file, turnId, gameId }
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const arrayBuffer = await file.arrayBuffer()
    const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' })
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const data = XLSX.utils.sheet_to_json(worksheet)

    console.log('Processing data:', data)

    for (const row of data) {
      const optionNumber = row['Option Number'] || row['optionnumber']
      
      const optionData = {
        title: row['Title'] || row['title'],
        description: row['Description'] || row['description'],
        image: row['Image URL'] || row['image'],
        impactkpi1: row['KPI 1'] || row['impactkpi1'],
        impactkpi1amount: parseFloat(row['KPI 1 Amount'] || row['impactkpi1amount']) || 0,
        impactkpi2: row['KPI 2'] || row['impactkpi2'],
        impactkpi2amount: parseFloat(row['KPI 2 Amount'] || row['impactkpi2amount']) || 0,
        impactkpi3: row['KPI 3'] || row['impactkpi3'],
        impactkpi3amount: parseFloat(row['KPI 3 Amount'] || row['impactkpi3amount']) || 0,
        game_uuid: gameId,
        turn_uuid: turnId,
        optionnumber: parseInt(optionNumber) || 1
      }

      const { data: existingOption } = await supabase
        .from('Options')
        .select('uuid')
        .eq('turn_uuid', turnId)
        .eq('game_uuid', gameId)
        .eq('optionnumber', optionData.optionnumber)
        .single()

      if (existingOption) {
        const { error } = await supabase
          .from('Options')
          .update(optionData)
          .eq('uuid', existingOption.uuid)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('Options')
          .insert([optionData])

        if (error) throw error
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }, 
        status: 500 
      }
    )
  }
})