import { PartialType } from "@nestjs/mapped-types";
import { CreateEventDto } from "./create-event.dto";


export class UpdateEventDto extends PartialType(CreateEventDto) {}

// by default the PartialType will make all the fields optional