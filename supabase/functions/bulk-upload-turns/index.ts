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

    const arrayBuffer = await file.arrayBuffer()
    const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' })
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const data = XLSX.utils.sheet_to_json(worksheet)

    for (const row of data) {
      const turnNumber = row['Turn Number']
      const challenge = row['Challenge']
      const description = row['Description']

      const { data: existingTurn, error: fetchError } = await supabase
        .from('Turns')
        .select('uuid')
        .eq('game_uuid', gameId)
        .eq('turnnumber', turnNumber)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError
      }

      if (existingTurn) {
        const { error } = await supabase
          .from('Turns')
          .update({
            challenge,
            description,
          })
          .eq('uuid', existingTurn.uuid)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('Turns')
          .insert([{
            turnnumber: turnNumber,
            challenge,
            description,
            game_uuid: gameId,
          }])

        if (error) throw error
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})