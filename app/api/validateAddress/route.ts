import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { validateAddress } from '../../lib/addressValidation';
import { authOptions } from '../../lib/auth';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  try {
    const { address } = await req.json();

    if (!address) {
      return NextResponse.json({ message: 'Address is required' }, { status: 400 });
    }

    const isValid = await validateAddress(address);

    return NextResponse.json({ isValid }, { status: 200 });
  } catch (error) {
    console.error('Error validating address:', error);
    return NextResponse.json({ message: 'Error validating address', error: (error as Error).message }, { status: 500 });
  }
}