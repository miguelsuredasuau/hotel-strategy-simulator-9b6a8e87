import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

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
    const gameId = parseInt(formData.get('gameId') as string)
    const type = formData.get('type') as string

    if (!file || !gameId || !type) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const text = await file.text()
    const rows = text.split('\n').map(row => row.split(','))
    
    if (type === 'turns') {
      const turns = rows.map((row, index) => ({
        turnnumber: parseInt(row[0]) || index + 1,
        challenge: row[1]?.trim(),
        description: row[2]?.trim(),
        game: gameId
      }))

      const { error } = await supabase.from('Turns').insert(turns)
      
      if (error) throw error
    } else if (type === 'options') {
      const options = rows.map((row, index) => ({
        turn: (async () => {
          const { data } = await supabase
            .from('Turns')
            .select('id')
            .eq('game', gameId)
            .eq('turnnumber', parseInt(row[0]))
            .single()
          return data?.id
        })(),
        title: row[1]?.trim(),
        description: row[2]?.trim(),
        image: row[3]?.trim(),
        impactkpi1: row[4]?.trim(),
        impactkpi1amount: parseFloat(row[5]) || 0,
        game: gameId,
        optionnumber: index + 1
      }))

      const resolvedOptions = await Promise.all(
        options.map(async (option) => ({
          ...option,
          turn: await option.turn
        }))
      )

      const { error } = await supabase.from('Options').insert(resolvedOptions)
      
      if (error) throw error
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