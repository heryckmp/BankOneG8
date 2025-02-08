import { Input } from "@/components/ui/input"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form"

  <FormField
    control={form.control}
    name="state"
    render={({ field }) => (
      <FormItem>
        <FormControl>
          <Input
            {...field}
            placeholder="State (e.g., NY)"
            type="text"
            maxLength={2}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value.toUpperCase();
              field.onChange(value);
            }}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  /> 