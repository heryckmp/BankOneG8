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
        <FormLabel className="form-label">State</FormLabel>
        <FormControl>
          <Input
            {...field}
            placeholder="State (e.g., NY)"
            type="text"
            maxLength={2}
            className="input-class"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
              field.onChange(value);
            }}
            value={field.value}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  /> 