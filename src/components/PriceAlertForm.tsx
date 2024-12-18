import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { PriceAlert } from '../types/price';
import { Button } from './ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Switch } from './ui/switch';
import { Checkbox } from './ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const alertSchema = z.object({
  type: z.enum(['price_drop', 'price_increase', 'threshold']),
  threshold: z.number().optional(),
  percentage: z.number().min(0).max(100).optional(),
  enabled: z.boolean(),
  notifyVia: z.array(z.enum(['email', 'push', 'in_app'])).min(1),
});

interface PriceAlertFormProps {
  onSubmit: (alert: PriceAlert) => void;
  initialData?: Partial<PriceAlert>;
  currentPrice?: number;
  className?: string;
}

const notificationChannels = [
  { id: 'email', label: 'Email' },
  { id: 'push', label: 'Push Notifications' },
  { id: 'in_app', label: 'In-App Notifications' },
];

export function PriceAlertForm({
  onSubmit,
  initialData,
  currentPrice,
  className,
}: PriceAlertFormProps) {
  const form = useForm<PriceAlert>({
    resolver: zodResolver(alertSchema),
    defaultValues: {
      type: 'price_drop',
      enabled: true,
      notifyVia: ['in_app'],
      ...initialData,
    },
  });

  const alertType = form.watch('type');

  const handleSubmit = (values: PriceAlert) => {
    onSubmit(values);
    form.reset(values);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Price Alert Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alert Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select alert type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="price_drop">Price Drop</SelectItem>
                      <SelectItem value="price_increase">Price Increase</SelectItem>
                      <SelectItem value="threshold">Price Threshold</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose when you want to be notified
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {alertType === 'threshold' && (
              <FormField
                control={form.control}
                name="threshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price Threshold ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder={currentPrice?.toString()}
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      You'll be notified when the price crosses this threshold
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {(alertType === 'price_drop' || alertType === 'price_increase') && (
              <FormField
                control={form.control}
                name="percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Percentage Change (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="5"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Minimum percentage change to trigger the alert
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Enable Alert
                    </FormLabel>
                    <FormDescription>
                      Receive notifications when conditions are met
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notifyVia"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">
                      Notification Channels
                    </FormLabel>
                    <FormDescription>
                      Select how you want to be notified
                    </FormDescription>
                  </div>
                  {notificationChannels.map((channel) => (
                    <FormField
                      key={channel.id}
                      control={form.control}
                      name="notifyVia"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={channel.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(channel.id as any)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, channel.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== channel.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {channel.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Save Alert</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}