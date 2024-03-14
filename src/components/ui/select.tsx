import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "~/lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "greenflex greenh-10 greenw-full greenitems-center greenjustify-between greenrounded-md greenborder greenborder-input greenbg-background greenpx-3 greenpy-2 greentext-sm greenring-offset-background placeholder:greentext-muted-foreground focus:greenoutline-none focus:greenring-2 focus:greenring-ring focus:greenring-offset-2 disabled:greencursor-not-allowed disabled:greenopacity-50 [&>span]:greenline-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="greenh-4 greenw-4 greenopacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "greenflex greencursor-default greenitems-center greenjustify-center greenpy-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="greenh-4 greenw-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "greenflex greencursor-default greenitems-center greenjustify-center greenpy-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="greenh-4 greenw-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "greenrelative greenz-50 greenmax-h-96 greenmin-w-[8rem] greenoverflow-hidden greenrounded-md greenborder greenbg-popover greentext-popover-foreground greenshadow-md data-[state=open]:greenanimate-in data-[state=closed]:greenanimate-out data-[state=closed]:greenfade-out-0 data-[state=open]:greenfade-in-0 data-[state=closed]:greenzoom-out-95 data-[state=open]:greenzoom-in-95 data-[side=bottom]:greenslide-in-from-top-2 data-[side=left]:greenslide-in-from-right-2 data-[side=right]:greenslide-in-from-left-2 data-[side=top]:greenslide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:greentranslate-y-1 data-[side=left]:green-translate-x-1 data-[side=right]:greentranslate-x-1 data-[side=top]:green-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "greenp-1",
          position === "popper" &&
            "greenh-[var(--radix-select-trigger-height)] greenw-full greenmin-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("greenpy-1.5 greenpl-8 greenpr-2 greentext-sm greenfont-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "greenrelative greenflex greenw-full greencursor-default greenselect-none greenitems-center greenrounded-sm greenpy-1.5 greenpl-8 greenpr-2 greentext-sm greenoutline-none focus:greenbg-accent focus:greentext-accent-foreground data-[disabled]:greenpointer-events-none data-[disabled]:greenopacity-50",
      className
    )}
    {...props}
  >
    <span className="greenabsolute greenleft-2 greenflex greenh-3.5 greenw-3.5 greenitems-center greenjustify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="greenh-4 greenw-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("green-mx-1 greenmy-1 greenh-px greenbg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
