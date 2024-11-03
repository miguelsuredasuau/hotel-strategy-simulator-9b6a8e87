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
    const turnId = formData.get('turnId') as string
    const gameId = formData.get('gameId') as string

    console.log('Received request with:', { turnId, gameId });

    if (!file || !turnId || !gameId) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields',
          received: { file: !!file, turnId, gameId }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
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

    console.log('Processing data:', data);

    for (const row of data) {
      const optionNumber = row['Option Number']
      const { data: existingOption } = await supabase
        .from('Options')
        .select('uuid')
        .eq('turn_uuid', turnId)
        .eq('game_uuid', gameId)
        .eq('optionnumber', optionNumber)
        .single()

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
        turn_uuid: turnId,
        optionnumber: optionNumber
      }

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
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})