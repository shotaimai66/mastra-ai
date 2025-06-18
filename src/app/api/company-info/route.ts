import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/vectordb/postgres';
import { createEmbedding } from '@/lib/embedding';

export async function POST(request: NextRequest) {
  try {
    const { title, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Create embedding for the content
    const embedding = await createEmbedding(content);

    // Save to database
    const pool = getPool();
    const result = await pool.query(
      `INSERT INTO company_info (title, content, embedding) 
       VALUES ($1, $2, $3) 
       RETURNING id, title, content, created_at`,
      [title, content, `[${embedding.join(',')}]`]
    );

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error saving company info:', error);
    return NextResponse.json(
      { error: 'Failed to save company info' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const pool = getPool();
    const result = await pool.query(
      'SELECT id, title, content, created_at FROM company_info ORDER BY created_at DESC'
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching company info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company info' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const pool = getPool();
    await pool.query('DELETE FROM company_info WHERE id = $1', [id]);

    return NextResponse.json({
      success: true,
      message: 'Company info deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting company info:', error);
    return NextResponse.json(
      { error: 'Failed to delete company info' },
      { status: 500 }
    );
  }
}