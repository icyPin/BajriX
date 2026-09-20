***

### The AI_USAGE.md File
```markdown
# AI Usage Declaration

During the development of BajriX, I utilized AI tools (LLMs) as an accelerator for productivity and a technical thought partner. 

models used - gemini 3.1 pro and sonnet 5

All core architectural decisions, database design patterns (such as the bridge table and optimistic locking), and the final system implementation are my own work.

To be specific,I used ai for:

1. Boilerplate Generation: Rapidly scaffolding standard React UI components, CSS styling, and Java DTO records to save manual typing time.

2. Mock Data Generation: Generating the 20 realistic, interconnected SQL `INSERT` statements used in the Flyway `V3` seeding script to ensure the UI could be tested with robust mock data.

3. Troubleshooting Support: Acting as a "rubber duck" debugger to quickly parse Spring Boot stack traces and resolve a Flyway unique constraint collision during development.

4. Documentation Refinement: Reviewing this `README.md` for grammatical polish and structural formatting. 


# Though there were few instances where i have to step in and implement a new method/way  rather than the one suggested by the ai :

1. Since the docs mentioned scaling and large db ai suggested we dont load teh data base of product when ui renders and only fetches the req product detail buyer searches for. i implemented spring build in page/pagable feature to give/stream  10 product at time solving the issue and making standard ui experience.

2. During the testig of the concurrency implementation due to hiberate first-lever caching the test was failing in a loop until a stepped in and hardcoded the jdbc update statement to simulate real world case. as mentioned in deployment this shoud work without it.

3. Although the ai does teh job fine building the outer structure of the requirement it need to be specifically told to implement samll features . like while generating the ui components it generated the search component but dindt include query for doing it which i have to do manually since my daily limit was exausting.