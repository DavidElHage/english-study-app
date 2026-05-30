// src/app/api/flashcards/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET: Busca todos os flashcards
export async function GET() {
  try {
    const flashcards = await prisma.flashcard.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(flashcards);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar dados' }, { status: 500 });
  }
}

// POST: Cria um novo flashcard
export async function POST(request: Request) {
  try {
    const { english, portuguese, context } = await request.json();
    
    if (!english || !portuguese) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes' }, { status: 400 });
    }

    const newCard = await prisma.flashcard.create({
      data: { english, portuguese, context },
    });

    return NextResponse.json(newCard, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao salvar no banco' }, { status: 500 });
  }
}