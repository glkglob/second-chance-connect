import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request) {
    try {
        // Services are public - no auth required
        const supabase = await createClient()

        const { searchParams } = new URL(request.url)
        const category = searchParams.get('category')
        const search = searchParams.get('search')

        let query = supabase.from('services').select(`
      id,
      name,
      category,
      contact_email,
      contact_phone,
      location,
      address,
      description,
      website_url,
      created_at
    `)

        // Apply filters
        if (category) {
            query = query.eq('category', category)
        }
        if (search) {
            query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,location.ilike.%${search}%`)
        }

        query = query.order('name', { ascending: true })

        const { data, error } = await query

        if (error) {
            console.error('[v0] Services API error:', error)
            return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 })
        }

        return NextResponse.json({ services: data || [] })
    } catch (error) {
        console.error('[v0] Services API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Check user role - only admins can create services
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (!profile || profile.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden - Only admins can create services' }, { status: 403 })
        }

        const body = await request.json()
        const {
            name,
            category,
            contact_email,
            contact_phone,
            location,
            address,
            description,
            website_url
        } = body

        // Validate required fields
        if (!name || !category || !location) {
            return NextResponse.json({
                error: 'Missing required fields: name, category, location'
            }, { status: 400 })
        }

        // Validate category
        const validCategories = ['HOUSING', 'EDUCATION', 'HEALTH', 'LEGAL', 'OTHER']
        if (!validCategories.includes(category)) {
            return NextResponse.json({
                error: `Invalid category. Must be one of: ${validCategories.join(', ')}`
            }, { status: 400 })
        }

        const { data, error } = await supabase
            .from('services')
            .insert({
                name,
                category,
                contact_email,
                contact_phone,
                location,
                address,
                description,
                website_url
            })
            .select()
            .single()

        if (error) {
            console.error('[v0] Create service error:', error)
            return NextResponse.json({ error: 'Failed to create service' }, { status: 500 })
        }

        return NextResponse.json({ service: data }, { status: 201 })
    } catch (error) {
        console.error('[v0] Create service error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
