import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '../../lib/prisma';
import { validateAddress } from '../../lib/addressValidation';
import { authOptions } from '../../lib/auth';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { firstName,  dateOfBirth, address, phoneNumber } = body;

    if (!firstName || !dateOfBirth || !address || !phoneNumber) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    const isValidAddress = await validateAddress(address);
    if (!isValidAddress) {
      return NextResponse.json({ message: 'Address must be within 50km of Paris' }, { status: 400 });
    }

    const parsedDate = new Date(dateOfBirth);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json({ message: 'Invalid date of birth' }, { status: 400 });
    }

    if (!session.user?.email) {
      return NextResponse.json({ message: 'User email is required for updating the profile' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { 
        name: `${firstName}`,
        dateOfBirth: parsedDate, 
        address, 
        phoneNumber 
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ message: 'Error updating profile', error: (error as Error).message }, { status: 500 });
  }
}