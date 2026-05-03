"use client";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/app/components/ui/input-otp";

type Props = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  /** Defaults to 6 — match API `OTP_LENGTH` */
  length?: number;
};

/**
 * Six separate digit boxes (modern OTP pattern) using Radix `input-otp`.
 */
export function OtpInputBoxes({ value, onChange, disabled, length = 6 }: Props) {
  return (
    <InputOTP
      maxLength={length}
      value={value}
      onChange={onChange}
      disabled={disabled}
      pattern="^[0-9]*$"
      inputMode="numeric"
      autoComplete="one-time-code"
      containerClassName="justify-center"
      className="disabled:opacity-50"
    >
      <InputOTPGroup className="gap-2 sm:gap-3">
        {Array.from({ length }).map((_, i) => (
          <InputOTPSlot
            key={i}
            index={i}
            className="size-11 rounded-xl border border-gray-600 bg-black text-lg font-semibold text-white shadow-sm sm:size-14 sm:text-xl first:!rounded-xl last:!rounded-xl first:!border-l last:!border-r data-[active=true]:z-10 data-[active=true]:border-yellow-400 data-[active=true]:bg-gray-950 data-[active=true]:ring-[3px] data-[active=true]:ring-yellow-400/35"
          />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
}
